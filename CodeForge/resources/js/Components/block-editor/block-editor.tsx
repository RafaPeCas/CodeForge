"use client"

import type React from "react"

import { useState } from "react"
import {
  PlusCircle,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  Code,
  Trash2,
  GripVertical,
  ChevronDown,
  FileDown,
  FileUp,
} from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Card } from "@/Components/ui/card"
import { Textarea } from "@/Components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { marked } from "marked"

type BlockType = "h1" | "h2" | "h3" | "paragraph" | "code"

interface Block {
  id: string
  type: BlockType
  content: string
  isEditing: boolean
}

export function BlockEditor() {
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "h1", content: "Welcome to Block Editor", isEditing: false },
    {
      id: "2",
      type: "paragraph",
      content:
        "This is a block-based editor similar to GitBook or ClickUp. You can add different types of blocks and edit them.",
      isEditing: false,
    },
  ])

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: "",
      isEditing: true,
    }
    setBlocks([...blocks, newBlock])
  }

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, content } : block)))
  }

  const toggleEditMode = (id: string) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, isEditing: !block.isEditing } : block)))
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id))
  }

  const moveBlock = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(fromIndex, 1)
    newBlocks.splice(toIndex, 0, movedBlock)
    setBlocks(newBlocks)
  }

  const renderBlockContent = (block: Block) => {
    if (block.isEditing) {
      return (
        <Textarea
          value={block.content}
          onChange={(e) => updateBlockContent(block.id, e.target.value)}
          className={cn(
            "w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            block.type === "code" && "font-mono bg-muted",
          )}
          rows={block.type === "code" ? 5 : 2}
          placeholder={`Enter ${block.type} content...`}
          autoFocus
        />
      )
    }

    switch (block.type) {
      case "h1":
        return <h1 className="text-3xl font-bold">{block.content || "Untitled"}</h1>
      case "h2":
        return <h2 className="text-2xl font-semibold">{block.content || "Untitled"}</h2>
      case "h3":
        return <h3 className="text-xl font-medium">{block.content || "Untitled"}</h3>
      case "paragraph":
        return <p className="text-base">{block.content || "Click to edit this paragraph"}</p>
      case "code":
        return (
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="text-sm font-mono">{block.content || "// Add your code here"}</code>
          </pre>
        )
      default:
        return null
    }
  }

  const getBlockIcon = (type: BlockType) => {
    switch (type) {
      case "h1":
        return <Heading1 className="h-4 w-4" />
      case "h2":
        return <Heading2 className="h-4 w-4" />
      case "h3":
        return <Heading3 className="h-4 w-4" />
      case "paragraph":
        return <AlignLeft className="h-4 w-4" />
      case "code":
        return <Code className="h-4 w-4" />
    }
  }

  const convertToMarkdown = () => {
    return blocks
      .map((block) => {
        switch (block.type) {
          case "h1":
            return `# ${block.content}\n\n`
          case "h2":
            return `## ${block.content}\n\n`
          case "h3":
            return `### ${block.content}\n\n`
          case "paragraph":
            return `${block.content}\n\n`
          case "code":
            return `\`\`\`\n${block.content}\n\`\`\`\n\n`
          default:
            return ""
        }
      })
      .join("")
  }

  const parseMarkdown = (markdown: string) => {
    const tokens = marked.lexer(markdown)
    const newBlocks: Block[] = []

    tokens.forEach((token, index) => {
      if (token.type === "heading") {
        newBlocks.push({
          id: Date.now().toString() + index,
          type: `h${token.depth}` as BlockType,
          content: token.text,
          isEditing: false,
        })
      } else if (token.type === "paragraph") {
        newBlocks.push({
          id: Date.now().toString() + index,
          type: "paragraph",
          content: token.text,
          isEditing: false,
        })
      } else if (token.type === "code") {
        newBlocks.push({
          id: Date.now().toString() + index,
          type: "code",
          content: token.text,
          isEditing: false,
        })
      }
    })

    setBlocks(newBlocks)
  }

  const exportMarkdown = () => {
    const markdown = convertToMarkdown()
    const blob = new Blob([markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "exported-content.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  const importMarkdown = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result
        if (typeof content === "string") {
          parseMarkdown(content)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Block Editor</h2>
        <div className="flex gap-2">
          <Button onClick={exportMarkdown} variant="outline" className="gap-2">
            <FileDown className="h-4 w-4" />
            Export Markdown
          </Button>
          <label htmlFor="import-markdown">
            <Button variant="outline" className="gap-2" as="span">
              <FileUp className="h-4 w-4" />
              Import Markdown
            </Button>
          </label>
          <input id="import-markdown" type="file" accept=".md" onChange={importMarkdown} className="hidden" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {blocks.map((block, index) => (
          <Card
            key={block.id}
            className={cn(
              "relative group transition-all duration-200 hover:shadow-md",
              block.isEditing && "ring-2 ring-primary ring-offset-2",
            )}
          >
            <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-start p-4 pl-8">
              <div className="flex-1" onClick={() => toggleEditMode(block.id)}>
                {renderBlockContent(block)}
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => toggleEditMode(block.id)} className="h-8 w-8">
                  {getBlockIcon(block.type)}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteBlock(block.id)}
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveBlock(index, index - 1)}
                    disabled={index === 0}
                    className="h-8 w-8"
                  >
                    <ChevronDown className="h-4 w-4 rotate-180" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => moveBlock(index, index + 1)}
                    disabled={index === blocks.length - 1}
                    className="h-8 w-8"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Block
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => addBlock("h1")}>
              <Heading1 className="h-4 w-4 mr-2" />
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("h2")}>
              <Heading2 className="h-4 w-4 mr-2" />
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("h3")}>
              <Heading3 className="h-4 w-4 mr-2" />
              Heading 3
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("paragraph")}>
              <AlignLeft className="h-4 w-4 mr-2" />
              Paragraph
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => addBlock("code")}>
              <Code className="h-4 w-4 mr-2" />
              Code Block
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

