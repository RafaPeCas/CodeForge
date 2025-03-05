import * as React from "react"
import { ChevronDown, ChevronRight, File, Folder, MoreHorizontal, Plus, Trash, Edit, Book } from 'lucide-react'
import axios from 'axios'
import { useOptimistic } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/Components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"


// Types
interface Page {
  id: string
  title: string
  parentId: string | null
  ancestors: string[]
}

interface Notebook {
  id: string
  name: string
  description: string
  pages: Page[]
}

type NotebookContextType = {
  notebook: Notebook | null
  addPage: (page: Omit<Page, "id" | "ancestors">) => Promise<void>
  updatePage: (id: string, title: string) => Promise<void>
  deletePage: (id: string) => Promise<void>
}

type Action =
| { type: 'ADD_PAGE'; payload: Page }
| { type: 'UPDATE_PAGE'; payload: { id: string; title: string } }
| { type: 'DELETE_PAGE'; payload: string };

// API client
const api = {
  addPage: async (notebookId: string, page: Omit<Page, "id" | "ancestors">): Promise<Page> => {
    // In a real app, this would be an actual API call
    const response = await axios.post(`/api/notebooks/${notebookId}/pages`, page)
    return response.data
  },
  
  updatePage: async (notebookId: string, pageId: string, title: string): Promise<Page> => {
    const response = await axios.patch(`/api/notebooks/${notebookId}/pages/${pageId}`, { title })
    return response.data
  },
  
  deletePage: async (notebookId: string, pageId: string): Promise<void> => {
    await axios.delete(`/api/notebooks/${notebookId}/pages/${pageId}`)
  }
}

// Context
const NotebookContext = React.createContext<NotebookContextType | undefined>(undefined)

function useNotebook() {
  const context = React.useContext(NotebookContext)
  if (!context) {
    throw new Error("useNotebook must be used within a NotebookProvider")
  }
  return context
}

// Provider
function NotebookProvider({ children, initialNotebook }: { 
  children: React.ReactNode
  initialNotebook: Notebook
}) {
  const [notebook, setNotebook] = React.useState<Notebook>(initialNotebook)
  
  // Calculate ancestors for a new page
  const calculateAncestors = (parentId: string | null): string[] => {
    if (!parentId) return []
    
    const parent = notebook.pages.find(p => p.id === parentId)
    if (!parent) return [parentId]
    
    return [...parent.ancestors, parentId]
  }

  // Optimistic state updates
  const optimisticReducer = (state:Notebook, action:Action) => {
    switch (action.type) {
      case 'ADD_PAGE': {
        const newPage = action.payload;
        return {
          ...state,
          pages: [...state.pages, newPage],
        };
      }
      case 'UPDATE_PAGE': {
        const { id, title } = action.payload;
        return {
          ...state,
          pages: state.pages.map((page) =>
            page.id === id ? { ...page, title } : page
          ),
        };
      }
      case 'DELETE_PAGE': {
        const id = action.payload;
        const descendants = getDescendants(id, state.pages);
        const idsToRemove = [id, ...descendants.map((d) => d.id)];

        return {
          ...state,
          pages: state.pages.filter((page) => !idsToRemove.includes(page.id)),
        };
      }
      default:
        return state;
    }
  };

  const [optimisticNotebook, addOptimisticUpdate] = useOptimistic(
    notebook,
    optimisticReducer
  );


  // Add a new page with optimistic update
  const addPage = async (page: Omit<Page, "id" | "ancestors">) => {
    if (!notebook) return
    
    // Create temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`
    
    // Create optimistic page
    const optimisticPage: Page = {
      ...page,
      id: tempId,
      ancestors: calculateAncestors(page.parentId)
    }
    
    // Apply optimistic update
    React.startTransition(() => {
      addOptimisticUpdate({ type: 'ADD_PAGE', payload: optimisticPage });
    });
    try {
      // Make API call
      const newPage = await api.addPage(notebook.id, page)
      
      // Update actual state with server response
      setNotebook(prev => ({
        ...prev,
        pages: [
          ...prev.pages.filter(p => p.id !== tempId),
          newPage
        ]
      }))
      
      // toast({
      //   title: "Page added",
      //   description: `"${page.title}" has been added successfully.`
      // })
      console.log("Page added:", newPage)
    } catch (error) {
      // Revert optimistic update on error
      setNotebook(prev => ({
        ...prev,
        pages: prev.pages.filter(p => p.id !== tempId)
      }))
      
      // toast({
      //   title: "Failed to add page",
      //   description: "There was an error adding the page. Please try again.",
      //   variant: "destructive"
      // })
      console.error("Error adding page:", error)
    }
  }

  // Update a page with optimistic update
  const updatePage = async (id: string, title: string) => {
    if (!notebook) return
    
    // Apply optimistic update
    React.startTransition(() => {
      addOptimisticUpdate({ type: 'UPDATE_PAGE', payload: { id, title } })
    });
    try {
      // Make API call
      await api.updatePage(notebook.id, id, title)
      
      // Update actual state
      setNotebook(prev => ({
        ...prev,
        pages: prev.pages.map(page => 
          page.id === id ? { ...page, title } : page
        )
      }))
      
      // toast({
      //   title: "Page updated",
      //   description: `"${title}" has been updated successfully.`
      // })
    } catch (error) {
      // Revert optimistic update on error
      setNotebook(prev => ({
        ...prev,
        pages: [...prev.pages] // Restore from previous state
      }))
      
      // toast({
      //   title: "Failed to update page",
      //   description: "There was an error updating the page. Please try again.",
      //   variant: "destructive"
      // })
      console.error("Error updating page:", error)
    }
  }

  // Delete a page with optimistic update
  const deletePage = async (id: string) => {
    if (!notebook) return
    
    // Store current state for potential rollback
    const previousPages = [...notebook.pages]
    
    // Apply optimistic update
    React.startTransition(() => {
      addOptimisticUpdate({ type: 'DELETE_PAGE', payload: id })
    });
    try {
      // Make API call
      await api.deletePage(notebook.id, id)
      
      // Get all descendant pages
      const descendants = getDescendants(id, notebook.pages)
      const idsToRemove = [id, ...descendants.map(d => d.id)]
      
      // Update actual state
      setNotebook(prev => ({
        ...prev,
        pages: prev.pages.filter(page => !idsToRemove.includes(page.id))
      }))
      
      // toast({
      //   title: "Page deleted",
      //   description: "The page and its children have been deleted successfully."
      // })
      console.log("Page deleted:", id)
    } catch (error) {
      // Revert optimistic update on error
      setNotebook(prev => ({
        ...prev,
        pages: previousPages
      }))
      
      // toast({
      //   title: "Failed to delete page",
      //   description: "There was an error deleting the page. Please try again.",
      //   variant: "destructive"
      // })
      console.error("Error deleting page:", error)
    }
  }

  const value = {
    notebook: optimisticNotebook,
    addPage,
    updatePage,
    deletePage
  }

  return (
    <NotebookContext.Provider value={value}>
      {children}
      {/* <Toaster /> */}
    </NotebookContext.Provider>
  )
}

// Helper function to get all descendants of a page
function getDescendants(pageId: string, allPages: Page[]): Page[] {
  const directChildren = allPages.filter(p => p.parentId === pageId)
  const descendants = [...directChildren]
  
  directChildren.forEach(child => {
    descendants.push(...getDescendants(child.id, allPages))
  })
  
  return descendants
}

// Tree Item Component
function TreeItem({ page, level = 0 }: { page: Page; level?: number }) {
  const { notebook, updatePage, deletePage, addPage } = useNotebook()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isRenaming, setIsRenaming] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState(page.title)
  const [isAddingPage, setIsAddingPage] = React.useState(false)
  const [newPageTitle, setNewPageTitle] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  
  if (!notebook) return null
  
  const children = notebook.pages.filter(p => p.parentId === page.id)
  const isFolder = children.length > 0
  const hasChildren = children.length > 0
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }
  
  const handleRename = async () => {
    if (newTitle.trim() && newTitle !== page.title) {
      setIsLoading(true)
      await updatePage(page.id, newTitle)
      setIsLoading(false)
    }
    setIsRenaming(false)
  }
  
  const handleDelete = async () => {
    setIsLoading(true)
    await deletePage(page.id)
    setIsLoading(false)
  }
  
  const handleAddPage = async () => {
    if (newPageTitle.trim()) {
      setIsLoading(true)
      await addPage({
        title: newPageTitle,
        parentId: page.id,
      })
      setIsLoading(false)
      setNewPageTitle("")
      setIsAddingPage(false)
      setIsExpanded(true)
    }
  }

  return (
    <div>
      <div className="flex items-center py-1 group">
        <div 
          className="flex items-center w-full"
          style={{ paddingLeft: `${level * 16}px` }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={handleToggle}
            disabled={isLoading}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              <div className="w-4" />
            )}
          </Button>
          
          {isFolder ? (
            <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
          ) : (
            <File className="h-4 w-4 mr-2 text-muted-foreground" />
          )}
          
          {isRenaming ? (
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                handleRename()
              }}
              className="flex-1"
            >
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-7 py-1"
                autoFocus
                onBlur={handleRename}
                disabled={isLoading}
              />
            </form>
          ) : (
            <span className={`flex-1 truncate ${isLoading ? 'opacity-50' : ''}`}>
              {page.title}
            </span>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                disabled={isLoading}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setIsRenaming(true)}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsAddingPage(true)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Page
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
                disabled={isLoading}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isAddingPage && (
        <div 
          className="flex items-center py-1"
          style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleAddPage()
            }}
            className="flex-1"
          >
            <Input
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="New page title"
              className="h-7 py-1"
              autoFocus
              disabled={isLoading}
              onBlur={() => {
                if (newPageTitle.trim()) {
                  handleAddPage()
                } else {
                  setIsAddingPage(false)
                }
              }}
            />
          </form>
        </div>
      )}
      
      {isExpanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <TreeItem key={child.id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// Root level component
function NotebookTree() {
  const { notebook, addPage } = useNotebook()
  const [isAddingRootPage, setIsAddingRootPage] = React.useState(false)
  const [newRootPageTitle, setNewRootPageTitle] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  
  if (!notebook) return null
  
  // Get root level pages
  const rootPages = notebook.pages.filter(p => p.parentId === null)
  
  const handleAddRootPage = async () => {
    if (newRootPageTitle.trim()) {
      setIsLoading(true)
      await addPage({
        title: newRootPageTitle,
        parentId: null,
      })
      setIsLoading(false)
      setNewRootPageTitle("")
      setIsAddingRootPage(false)
    }
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3 mb-2">
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2" />
          <h3 className="font-medium">{notebook.name}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => setIsAddingRootPage(true)}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {isAddingRootPage && (
        <div className="px-3 py-1">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleAddRootPage()
            }}
          >
            <Input
              value={newRootPageTitle}
              onChange={(e) => setNewRootPageTitle(e.target.value)}
              placeholder="New page title"
              className="h-7 py-1"
              autoFocus
              disabled={isLoading}
              onBlur={() => {
                if (newRootPageTitle.trim()) {
                  handleAddRootPage()
                } else {
                  setIsAddingRootPage(false)
                }
              }}
            />
          </form>
        </div>
      )}
      
      <div className="mt-2">
        {rootPages.map((page) => (
          <TreeItem key={page.id} page={page} />
        ))}
      </div>
    </div>
  )
}

// Main Sidebar Component
export function NotebookSidebar() {
  // Sample data - in a real app, this would come from an API or props
  const sampleNotebook: Notebook = {
    id: "notebook-1",
    name: "My Notebook",
    description: "Personal notes and documents",
    pages: [
      {
        id: "page-1",
        title: "Getting Started",
        parentId: null,
        ancestors: [],
      },
      {
        id: "page-2",
        title: "Project Ideas",
        parentId: null,
        ancestors: [],
      },
      {
        id: "page-3",
        title: "Web Development",
        parentId: "page-2",
        ancestors: ["page-2"],
      },
      {
        id: "page-4",
        title: "Code Projects",
        parentId: "page-3",
        ancestors: ["page-2", "page-3"],
      },
      {
        id: "page-5",
        title: "Mobile Apps",
        parentId: "page-2",
        ancestors: ["page-2"],
      }
    ]
  }

  return (
    <NotebookProvider initialNotebook={sampleNotebook}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg">
                  <div className="flex items-center">
                    <Book className="h-5 w-5 mr-2" />
                    <span className="font-medium">Notebooks</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <NotebookTree />
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
      </SidebarProvider>
    </NotebookProvider>
  )
}
//-----------------------------------------

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"

// Types
interface Page {
  id: string
  title: string
  parentId: string | null
  ancestors: string[]
  notebookId: string
}

interface Notebook {
  id: string
  name: string
  description: string
  pages: Page[]
}

type NotebooksContextType = {
  notebooks: Notebook[]
  addNotebook: (notebook: Omit<Notebook, "id" | "pages">) => Promise<void>
  deleteNotebook: (id: string) => Promise<void>
  addPage: (notebookId: string, page: Omit<Page, "id" | "ancestors">) => Promise<void>
  updatePage: (notebookId: string, id: string, title: string) => Promise<void>
  deletePage: (notebookId: string, id: string) => Promise<void>
}

// API client
const api = {
  addNotebook: async (notebook: Omit<Notebook, "id" | "pages">): Promise<Notebook> => {
    const response = await axios.post('/api/notebooks', notebook)
    return response.data
  },
  
  deleteNotebook: async (id: string): Promise<void> => {
    await axios.delete(`/api/notebooks/${id}`)
  },
  
  addPage: async (notebookId: string, page: Omit<Page, "id" | "ancestors">): Promise<Page> => {
    const response = await axios.post(`/api/notebooks/${notebookId}/pages`, page)
    return response.data
  },
  
  updatePage: async (notebookId: string, pageId: string, title: string): Promise<Page> => {
    const response = await axios.patch(`/api/notebooks/${notebookId}/pages/${pageId}`, { title })
    return response.data
  },
  
  deletePage: async (notebookId: string, pageId: string): Promise<void> => {
    await axios.delete(`/api/notebooks/${notebookId}/pages/${pageId}`)
  }
}

// Context
const NotebooksContext = React.createContext<NotebooksContextType | undefined>(undefined)

function useNotebooks() {
  const context = React.useContext(NotebooksContext)
  if (!context) {
    throw new Error("useNotebooks must be used within a NotebooksProvider")
  }
  return context
}

// Provider
function NotebooksProvider({ children, initialNotebooks }: { 
  children: React.ReactNode
  initialNotebooks: Notebook[]
}) {
  const [notebooks, setNotebooks] = React.useState<Notebook[]>(initialNotebooks)
  
  // Optimistic state updates
  const [optimisticNotebooks, addOptimisticUpdate] = useOptimistic(
    notebooks,
    (state, action: { type: string; payload: any }) => {
      switch (action.type) {
        case 'ADD_NOTEBOOK': {
          const newNotebook = action.payload
          return [...state, newNotebook]
        }
        case 'DELETE_NOTEBOOK': {
          const id = action.payload
          return state.filter(notebook => notebook.id !== id)
        }
        case 'ADD_PAGE': {
          const { notebookId, newPage } = action.payload
          return state.map(notebook => 
            notebook.id === notebookId
              ? { ...notebook, pages: [...notebook.pages, newPage] }
              : notebook
          )
        }
        case 'UPDATE_PAGE': {
          const { notebookId, id, title } = action.payload
          return state.map(notebook => 
            notebook.id === notebookId
              ? {
                  ...notebook,
                  pages: notebook.pages.map(page => 
                    page.id === id ? { ...page, title } : page
                  )
                }
              : notebook
          )
        }
        case 'DELETE_PAGE': {
          const { notebookId, id } = action.payload
          return state.map(notebook => 
            notebook.id === notebookId
              ? {
                  ...notebook,
                  pages: notebook.pages.filter(page => page.id !== id)
                }
              : notebook
          )
        }
        default:
          return state
      }
    }
  )

  // Calculate ancestors for a new page
  const calculateAncestors = (notebook: Notebook, parentId: string | null): string[] => {
    if (!parentId) return []
    
    const parent = notebook.pages.find(p => p.id === parentId)
    if (!parent) return [parentId]
    
    return [...parent.ancestors, parentId]
  }

  // Add a new notebook with optimistic update
  const addNotebook = async (notebook: Omit<Notebook, "id" | "pages">) => {
    // Create temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`
    
    // Create optimistic notebook
    const optimisticNotebook: Notebook = {
      ...notebook,
      id: tempId,
      pages: []
    }
    
    // Apply optimistic update
    addOptimisticUpdate({ type: 'ADD_NOTEBOOK', payload: optimisticNotebook })
    
    try {
      // Make API call
      const newNotebook = await api.addNotebook(notebook)
      
      // Update actual state with server response
      setNotebooks(prev => [...prev.filter(n => n.id !== tempId), newNotebook])
      
      toast({
        title: "Notebook added",
        description: `"${notebook.name}" has been added successfully.`
      })
    } catch (error) {
      // Revert optimistic update on error
      setNotebooks(prev => prev.filter(n => n.id !== tempId))
      
      toast({
        title: "Failed to add notebook",
        description: "There was an error adding the notebook. Please try again.",
        variant: "destructive"
      })
      console.error("Error adding notebook:", error)
    }
  }

  // Delete a notebook with optimistic update
  const deleteNotebook = async (id: string) => {
    // Store current state for potential rollback
    const previousNotebooks = [...notebooks]
    
    // Apply optimistic update
    addOptimisticUpdate({ type: 'DELETE_NOTEBOOK', payload: id })
    
    try {
      // Make API call
      await api.deleteNotebook(id)
      
      // Update actual state
      setNotebooks(prev => prev.filter(notebook => notebook.id !== id))
      
      toast({
        title: "Notebook deleted",
        description: "The notebook has been deleted successfully."
      })
    } catch (error) {
      // Revert optimistic update on error
      setNotebooks(previousNotebooks)
      
      toast({
        title: "Failed to delete notebook",
        description: "There was an error deleting the notebook. Please try again.",
        variant: "destructive"
      })
      console.error("Error deleting notebook:", error)
    }
  }

  // Add a new page with optimistic update
  const addPage = async (notebookId: string, page: Omit<Page, "id" | "ancestors">) => {
    const notebook = notebooks.find(n => n.id === notebookId)
    if (!notebook) return
    
    // Create temporary ID for optimistic update
    const tempId = `temp-${Date.now()}`
    
    // Create optimistic page
    const optimisticPage: Page = {
      ...page,
      id: tempId,
      ancestors: calculateAncestors(notebook, page.parentId)
    }
    
    // Apply optimistic update
    addOptimisticUpdate({ type: 'ADD_PAGE', payload: { notebookId, newPage: optimisticPage } })
    
    try {
      // Make API call
      const newPage = await api.addPage(notebookId, page)
      
      // Update actual state with server response
      setNotebooks(prev => prev.map(n => 
        n.id === notebookId
          ? { ...n, pages: [...n.pages.filter(p => p.id !== tempId), newPage] }
          : n
      ))
      
      toast({
        title: "Page added",
        description: `"${page.title}" has been added successfully.`
      })
    } catch (error) {
      // Revert optimistic update on error
      setNotebooks(prev => prev.map(n => 
        n.id === notebookId
          ? { ...n, pages: n.pages.filter(p => p.id !== tempId) }
          : n
      ))
      
      toast({
        title: "Failed to add page",
        description: "There was an error adding the page. Please try again.",
        variant: "destructive"
      })
      console.error("Error adding page:", error)
    }
  }

  // Update a page with optimistic update
  const updatePage = async (notebookId: string, id: string, title: string) => {
    // Apply optimistic update
    addOptimisticUpdate({ type: 'UPDATE_PAGE', payload: { notebookId, id, title } })
    
    try {
      // Make API call
      await api.updatePage(notebookId, id, title)
      
      // Update actual state
      setNotebooks(prev => prev.map(notebook => 
        notebook.id === notebookId
          ? {
              ...notebook,
              pages: notebook.pages.map(page => 
                page.id === id ? { ...page, title } : page
              )
            }
          : notebook
      ))
      
      toast({
        title: "Page updated",
        description: `"${title}" has been updated successfully.`
      })
    } catch (error) {
      // Revert optimistic update on error
      setNotebooks(prev => [...prev]) // Restore from previous state
      
      toast({
        title: "Failed to update page",
        description: "There was an error updating the page. Please try again.",
        variant: "destructive"
      })
      console.error("Error updating page:", error)
    }
  }

  // Delete a page with optimistic update
  const deletePage = async (notebookId: string, id: string) => {
    // Store current state for potential rollback
    const previousNotebooks = [...notebooks]
    
    // Apply optimistic update
    addOptimisticUpdate({ type: 'DELETE_PAGE', payload: { notebookId, id } })
    
    try {
      // Make API call
      await api.deletePage(notebookId, id)
      
      // Update actual state
      setNotebooks(prev => prev.map(notebook => 
        notebook.id === notebookId
          ? {
              ...notebook,
              pages: notebook.pages.filter(page => page.id !== id)
            }
          : notebook
      ))
      
      toast({
        title: "Page deleted",
        description: "The page has been deleted successfully."
      })
    } catch (error) {
      // Revert optimistic update on error
      setNotebooks(previousNotebooks)
      
      toast({
        title: "Failed to delete page",
        description: "There was an error deleting the page. Please try again.",
        variant: "destructive"
      })
      console.error("Error deleting page:", error)
    }
  }

  const value = {
    notebooks: optimisticNotebooks,
    addNotebook,
    deleteNotebook,
    addPage,
    updatePage,
    deletePage
  }

  return (
    <NotebooksContext.Provider value={value}>
      {children}
      <Toaster />
    </NotebooksContext.Provider>
  )
}

// Tree Item Component
function TreeItem({ notebookId, page, level = 0 }: { notebookId: string; page: Page; level?: number }) {
  const { notebooks, updatePage, deletePage, addPage } = useNotebooks()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isRenaming, setIsRenaming] = React.useState(false)
  const [newTitle, setNewTitle] = React.useState(page.title)
  const [isAddingPage, setIsAddingPage] = React.useState(false)
  const [newPageTitle, setNewPageTitle] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  
  const notebook = notebooks.find(n => n.id === notebookId)
  if (!notebook) return null
  
  const children = notebook.pages.filter(p => p.parentId === page.id)
  const isFolder = children.length > 0
  const hasChildren = children.length > 0
  
  const handleToggle = () => {
    setIsExpanded(!isExpanded)
  }
  
  const handleRename = async () => {
    if (newTitle.trim() && newTitle !== page.title) {
      setIsLoading(true)
      await updatePage(notebookId, page.id, newTitle)
      setIsLoading(false)
    }
    setIsRenaming(false)
  }
  
  const handleDelete = async () => {
    setIsLoading(true)
    await deletePage(notebookId, page.id)
    setIsLoading(false)
  }
  
  const handleAddPage = async () => {
    if (newPageTitle.trim()) {
      setIsLoading(true)
      await addPage(notebookId, {
        title: newPageTitle,
        parentId: page.id,
      })
      setIsLoading(false)
      setNewPageTitle("")
      setIsAddingPage(false)
      setIsExpanded(true)
    }
  }

  return (
    <div>
      <div className="flex items-center py-1 group">
        <div 
          className="flex items-center w-full"
          style={{ paddingLeft: `${level * 16}px` }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={handleToggle}
            disabled={isLoading}
          >
            {hasChildren ? (
              isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              <div className="w-4" />
            )}
          </Button>
          
          {isFolder ? (
            <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
          ) : (
            <File className="h-4 w-4 mr-2 text-muted-foreground" />
          )}
          
          {isRenaming ? (
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                handleRename()
              }}
              className="flex-1"
            >
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="h-7 py-1"
                autoFocus
                onBlur={handleRename}
                disabled={isLoading}
              />
            </form>
          ) : (
            <span className={`flex-1 truncate ${isLoading ? 'opacity-50' : ''}`}>
              {page.title}
            </span>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100"
                disabled={isLoading}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                onClick={() => setIsRenaming(true)}
                disabled={isLoading}
              >
                <Edit className="h-4 w-4 mr-2" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsAddingPage(true)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Page
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
                disabled={isLoading}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isAddingPage && (
        <div 
          className="flex items-center py-1"
          style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleAddPage()
            }}
            className="flex-1"
          >
            <Input
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="New page title"
              className="h-7 py-1"
              autoFocus
              disabled={isLoading}
              onBlur={() => {
                if (newPageTitle.trim()) {
                  handleAddPage()
                } else {
                  setIsAddingPage(false)
                }
              }}
            />
          </form>
        </div>
      )}
      
      {isExpanded && children.length > 0 && (
        <div>
          {children.map((child) => (
            <TreeItem key={child.id} notebookId={notebookId} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

// Notebook Component
function NotebookTree({ notebook }: { notebook: Notebook }) {
  const { addPage } = useNotebooks()
  const [isAddingRootPage, setIsAddingRootPage] = React.useState(false)
  const [newRootPageTitle, setNewRootPageTitle] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  
  // Get root level pages
  const rootPages = notebook.pages.filter(p => p.parentId === null)
  
  const handleAddRootPage = async () => {
    if (newRootPageTitle.trim()) {
      setIsLoading(true)
      await addPage(notebook.id, {
        title: newRootPageTitle,
        parentId: null,
      })
      setIsLoading(false)
      setNewRootPageTitle("")
      setIsAddingRootPage(false)
    }
  }

  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3 mb-2">
        <div className="flex items-center">
          <Book className="h-5 w-5 mr-2" />
          <h3 className="font-medium">{notebook.name}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={() => setIsAddingRootPage(true)}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {isAddingRootPage && (
        <div className="px-3 py-1">
          <form 
            onSubmit={(e) => {
              e.preventDefault()
              handleAddRootPage()
            }}
          >
            <Input
              value={newRootPageTitle}
              onChange={(e) => setNewRootPageTitle(e.target.value)}
              placeholder="New page title"
              className="h-7 py-1"
              autoFocus
              disabled={isLoading}
              onBlur={() => {
                if (newRootPageTitle.trim()) {
                  handleAddRootPage()
                } else {
                  setIsAddingRootPage(false)
                }
              }}
            />
          </form>
        </div>
      )}
      
      <div className="mt-2">
        {rootPages.map((page) => (
          <TreeItem key={page.id} notebookId={notebook.id} page={page} />
        ))}
      </div>
    </div>
  )
}

// Add Notebook Dialog
function AddNotebookDialog() {
  const { addNotebook } = useNotebooks()
  const [isOpen, setIsOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      setIsLoading(true)
      await addNotebook({ name, description })
      setIsLoading(false)
      setName("")
      setDescription("")
      setIsOpen(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Notebook
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

// Main Sidebar Component
export function NotebookSidebar() {
  const { notebooks, deleteNotebook } = useNotebooks()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex items-center">
                  <Book className="h-5 w-5 mr-2" />
                  <span className="font-medium">Notebooks</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <AddNotebookDialog />
        </SidebarHeader>
        <SidebarContent>
          {notebooks.map((notebook) => (
            <div key={notebook.id} className="mb-4">
              <NotebookTree notebook={notebook} />
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive ml-3 mt-2"
                onClick={() => deleteNotebook(notebook.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Notebook
              </Button>
            </div>
          ))}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  )
}