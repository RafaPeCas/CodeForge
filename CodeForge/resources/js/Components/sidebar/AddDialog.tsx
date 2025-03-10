import { FormEvent, useState } from "react"
import { useNotebooks } from "../../contexts/notebookContext"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog"
import { Button } from "@/Components"
import { Plus } from "lucide-react"
import { Label } from "@/Components/ui/label"
import { Input } from "@/Components/ui/input"

export function AddNotebookDialog() {
    const { addNotebook } = useNotebooks()
    const [isOpen, setIsOpen] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
  
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault()
      if (name.trim()) {
        setIsLoading(true)
        const savedSpace = localStorage.getItem("activeSpace");
        const spaceId = savedSpace ? JSON.parse(savedSpace).id : null
        await addNotebook({ name, description, spaceId: spaceId })
        setIsLoading(false)
        setName("")
        setDescription("")
        setIsOpen(false)
      }
    }
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Notebook</DialogTitle>
            <DialogDescription>
              Create a new notebook to organize your pages.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Notebook"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }
  