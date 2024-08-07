import { decode } from 'html-entities';

type Props = {
    components: Component[]
}

const TemplateBuilder = ({ components }: Props) => {

    let html = ""
    for (const section of components) {
        const doc = new DOMParser().parseFromString(section.content, "text/html")
        
        for (const placeholder of section.placeholders) {
            const node = doc.querySelector(`[data-template-it_id='${placeholder.id}']`)
            if (!node) continue
            node.insertAdjacentText("beforebegin", placeholder.fallback)
            node.remove()
        }

        html += doc.body.innerHTML
    }

    if (components[0].placeholders.length === 0) {
        return (
            <div className='w-full grow flex items-center justify-center flex-col text-md font-semibold text-center md:text-3xl'>Start adding placeholders</div>
        )
    }
    
    return (
        <div className="w-full flex flex-col gap-2 relative bg-slate-50 p-2 grow">
            <iframe srcDoc={decode(html)} className="h-full w-full">
            </iframe>
        </div>
    )
}

export default TemplateBuilder
