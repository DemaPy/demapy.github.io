import { PlusCircle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useState } from 'react'
import { useSectionCreateModal } from '@/store/sectionCreateModal'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateSection } from '../../hooks/useSection'
import ComponentsSkeleton from '@/pages/Components/components/Skeleton'
import Error from '@/pages/Error/Error'
import toast from 'react-hot-toast'
import Editor from '@/components/Editor/Editor'
import { CreatePlaceholdersDTO } from '@/services/types/Placeholder'

type Props = {
    template_id: string
}

const CreateSection = ({ template_id }: Props) => {

    const { isPending, isError, error, mutate } = useCreateSection({ invalidate_key: template_id })

    const isOpen = useSectionCreateModal(state => state.isOpen)
    const setClose = useSectionCreateModal(state => state.setClose)
    const setIsOpen = useSectionCreateModal(state => state.setOpen)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [placeholders, setPlaceholders] = useState<CreatePlaceholdersDTO['placeholders']>([])

    if (isPending) return <ComponentsSkeleton />

    if (isError) {
        toast.error(error.message);
        return <Error error={error} message={error.message} path={`/templates/${template_id}`} />
    }

    const handleEditorSubmit = (data: EditorOnSubmitProps) => {
        setContent(data.content)
        setPlaceholders(data.placeholdersToCreate)
    }

    return (
        <>
            <Button variant={"ghost"} className='bg-slate-50 rounded-sm sticky top-0 flex justify-between w-full' onClick={setIsOpen}>Create section <PlusCircle className="w-4 h-4" /></Button>
            <Dialog open={isOpen} onOpenChange={setClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create section</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-left">
                                Name
                            </Label>
                            <Input
                                placeholder='section title'
                                id="name"
                                value={title}
                                onChange={ev => setTitle(ev.target.value)}
                                className="col-span-4"
                            />
                            <div className="col-span-4 resize-y max-h-[500px] min-h-[300px]">
                                <Label htmlFor="content" className="text-left">
                                    Content
                                </Label>
                                <Editor
                                    content={content}
                                    placeholders={[]}
                                    isLoading={isPending}
                                    isContentEditable={true}
                                    onSubmit={handleEditorSubmit}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={isPending} onClick={() => {
                            mutate(({ templateId: template_id, content, title: title, placeholders }))
                            setClose()
                        }}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>

    )
}

export default CreateSection