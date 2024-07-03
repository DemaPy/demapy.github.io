import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ComponentService } from '@/services/DI/Component';
import { SectionService } from '@/services/DI/Section';
import { handleResponse } from '@/utils/handleResponse';
import { PlusCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
    content: string
    item: Component | Section
    PlaceholderService: typeof ComponentService | typeof SectionService
}

export const Editor = ({ content, item, PlaceholderService }: Props) => {
    const [position, setPosition] = useState<number | null>(null)
    const location = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState<boolean>(false)

    const [title, setTitle] = useState("")
    const [fallback, setFallback] = useState("")

    const [placeholders, setPlaceholders] = useState<Placeholder[]>([])
    const [isEditing, setIsEditing] = useState(false);
    const ref = useRef<HTMLIFrameElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!inputRef.current) return
        inputRef.current.focus()
    }, [position])

    useEffect(() => {
        if (!ref.current) return;
        const iframe = ref.current.contentDocument;
        if (!iframe) {
            return console.warn("Document not found")
        }
        const body = iframe.body;
        body.innerHTML = content;
        for (const item of [...body.querySelectorAll("span")]) {
            item.addEventListener("click", () => console.log("Test"));
        }
    }, []);

    useEffect(() => {
        if (!ref.current) return;
        const iframe = ref.current.contentDocument;

        const handleClick = (e: MouseEvent) => {
            if (!e.ctrlKey) return
            const isSpanPlaceholder = (e.target as HTMLElement).getAttribute("data-template-it_id");
            if (isSpanPlaceholder) return;

            if (!ref.current) return;
            const iframe = ref.current.contentDocument;
            if (!iframe) {
                return console.warn("Document not found")
            }
            const selection = iframe!.getSelection();
            if (!selection) return
            if (!selection.anchorNode) return
            if (selection.anchorNode.nodeName === "BODY") {
                console.log("Please select place");
                return
            }
            setPosition(selection.anchorOffset)
            setIsEditing(true);
        };

        iframe!.addEventListener("click", handleClick);

        return () => {
            iframe!.removeEventListener("click", handleClick);
        };
    }, []);

    const handleSave = async () => {
        if (!ref.current) return;
        const iframe = ref.current.contentDocument;
        if (!iframe) {
            return console.warn("Document not found")
        }
        const body = iframe.body;

        setLoading(true)
        // TODO body.innerHTML
        const response = await PlaceholderService.update({ id: item.id, content: body.innerHTML, title: item.title, placeholders: placeholders })
        const parsed = handleResponse<Component | Section>(response, location, navigate)
        if (parsed) {
            console.log(parsed.data!)
        }
        setLoading(false)
    }

    const handleAddPlaceholder = () => {
        if (fallback.trim().length < 3 || title.trim().length < 3) {
            return alert("Min length 3 symbols")
        }

        if (!ref.current) return;
        const iframe = ref.current.contentDocument;
        if (!iframe) {
            return console.warn("Document not found")
        }
        const selection = iframe!.getSelection();
        if (!selection) return
        if (!selection.anchorNode) return
        if (selection.anchorNode.nodeName === "BODY") {
            console.log("Please select place");
            return
        }
        // Create Range
        const range = new Range();
        range.setStart(selection.anchorNode!, selection.anchorOffset);
        selection.addRange(range);
        // Create Span
        const span = document.createElement("span");
        span.textContent = title
        span.style.cssText = "cursor: pointer; padding: 0.2rem 0.4rem; border-radius: 0.2rem; border: 1px solid black; background: #ececec; font-size: 14px; box-shadow: 0px 0px 5px #00000060";
        span.setAttribute("data-template-it_id", Date.now() + "");
        span.addEventListener("click", () => {
            console.log("Placeholder created");
        });
        range.insertNode(span);
        setPlaceholders(prev => ([...prev, { id: Date.now() + "", title, fallback }]))
        setTitle("");
        setFallback("");
        setPosition(null)
    }

    const handleCancel = () => {
        if (!ref.current) return;
        const iframe = ref.current.contentDocument;
        if (!iframe) {
            return console.warn("Document not found")
        }
        const body = iframe.body;
        body.innerHTML = content;
        setTitle("");
        setFallback("");
        setPosition(null)
        setIsEditing(false);
    }

    return (
        <>
            <iframe
                className='w-full min-h-64 bg-slate-50 rounded'
                ref={ref}
                src=""
                frameBorder="0"
            ></iframe>
            {isEditing && (
                <>
                    {position && (
                        <div className='p-4 bg-slate-50 rounded space-y-2'>
                            <Label className='flex flex-col gap-2'>
                                Title
                                <div className='flex items-stretch gap-2'>
                                    <Input ref={inputRef} value={title} onChange={(ev) => setTitle(ev.target.value)} />
                                    <Button variant={"outline"} onClick={handleAddPlaceholder}><PlusCircle className='w-4 h-4 mr-2' />Add</Button>
                                </div>
                            </Label>
                            <Label className='flex flex-col gap-2'>
                                Fallback
                                <Input value={fallback} onChange={(ev) => setFallback(ev.target.value)} />
                            </Label>
                        </div>
                    )}
                    <div className='flex gap-2'>
                        <Button onClick={handleCancel} className='w-full' variant={"ghost"} size={"sm"}>cancel</Button>
                        <Button disabled={loading} onClick={handleSave} className='w-full' variant={"outline"} size={"sm"}>save</Button>
                    </div>
                </>
            )}
        </>
    )
}
