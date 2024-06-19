import { useTemplateCreateModal } from '@/store/templateCreateModal'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { TemplateService } from '@/services/DI/Template'
import { useTemplateUpdateModal } from '@/store/templateUpdateModal'
import { useLocation, useNavigate } from 'react-router-dom'


const CreateTemplate = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const isOpen = useTemplateCreateModal(state => state.isOpen)
    const setClose = useTemplateCreateModal(state => state.setClose)
    const [templateName, setTemplateName] = useState("")
    const setTemplate = useTemplateUpdateModal(state => state.setTemplate)

    const onSubmit = async () => {
        if (templateName.length >= 3) {
            const response = await TemplateService.create({ title: templateName })
            if (response.status === "error") {
                if ("errors" in response) {
                    let error_message = ""
                    for (const error of response.errors) {
                        error_message += response.message + ": " + error.msg
                    }
                    alert(error_message)
                    return
                }

                if ("code" in response && response.code === 401) {
                    navigate(`/login?redirect=${location.pathname}`)
                }

                if ("code" in response && response.code === 403) {
                    navigate(`/access-denied`)
                }
    
                alert(response.message)
                return
            }
            
            setTemplate(response.data!)
            setClose()
        } else {
            alert("Minimum length: 3 symbols.")
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create template</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-left">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={templateName}
                            onChange={ev => setTemplateName(ev.target.value)}
                            className="col-span-4"
                        />
                        {/* <Label htmlFor="wrapper" className="text-left">
                            Wrapper
                        </Label>
                        <Textarea
                            id="wrapper"
                            value={wrapper}
                            onChange={ev => setTemplateWrapper(ev.target.value)}
                            className="col-span-4"
                        /> */}
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onSubmit}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}

export default CreateTemplate