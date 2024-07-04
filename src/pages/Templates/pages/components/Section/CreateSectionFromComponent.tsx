import { PlusCircle } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSectionFromComponentCreateModal } from '@/store/sectionFromComponentCreateModal'
import { Textarea } from '@/components/ui/textarea'
import { TemplateService } from '@/services/DI/Template'
import { useSectionCreateModal } from '@/store/sectionCreateModal'
import SectionFromComponentBuilder from '@/pages/Components/pages/components/SectionFromComponentBuilder'
import ComponentSelect from '../ComponentSelect'
import { handleResponse } from '@/utils/handleResponse'
import { useLocation, useNavigate } from 'react-router-dom'

type Props = {
    template_id: string
    components: Component[]
}

const CreateSectionFromComponent = ({ template_id, components }: Props) => {
    const location = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)

    const isOpen = useSectionFromComponentCreateModal(state => state.isOpen)
    const setClose = useSectionFromComponentCreateModal(state => state.setClose)
    const setIsOpen = useSectionFromComponentCreateModal(state => state.setOpen)
    const setSection = useSectionCreateModal(state => state.setSection)

    const [title, setTitle] = useState("")
    const [component_id, setComponent] = useState<string | null>(null)
    const component = components.find(item => item.id === component_id)

    const onSubmit = async () => {
        if (title.length >= 3 && component_id) {
            if (!component) return
            setLoading(true)
            const response = await TemplateService.createSectionFromComponent({ templateId: template_id, content: component.content, placeholders: component.placeholders, title: title })
            const parsed = handleResponse<Section>(response, location, navigate)
            if (parsed) {
                setSection(parsed.data!)
            }
            setLoading(false)
            setClose()
        } else {
            alert("Minimum length 3 symbols")
        }
    }

    if (!components) {
        return null
    }

    return (
        <>
            <Button variant={"ghost"} className='bg-slate-50 rounded-sm sticky top-0 flex justify-between w-full mb-4' onClick={setIsOpen}>Create section from component<PlusCircle className="w-4 h-4" /></Button>
            <Dialog open={isOpen} onOpenChange={setClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create section from component</DialogTitle>
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
                            <ComponentSelect components={components} setComponent={setComponent} component_id={component_id || ""} />
                            {component && (
                                <>
                                    <Tabs defaultValue="content" className='col-span-4'>
                                        <TabsList>
                                            <TabsTrigger value="content">Content</TabsTrigger>
                                            <TabsTrigger value="preview">Preview</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="content">
                                            <Label htmlFor="content" className="text-left">
                                                Content
                                            </Label>
                                            <Textarea
                                                id="content"
                                                value={component.content}
                                                disabled={true}
                                                className="col-span-4 resize-none w-full min-h-60"
                                            />
                                        </TabsContent>
                                        <TabsContent value="preview">
                                            <SectionFromComponentBuilder components={[component]} />
                                        </TabsContent>
                                    </Tabs>
                                </>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={loading} onClick={onSubmit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>

    )
}

export default CreateSectionFromComponent