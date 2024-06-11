import NavbarBuilder from "./NavbarBuilder"

type Props = {
    sections: Section[] | null
    campaign: Campaign
    slug: string | null
    layout: Layout[]
}

const CampaignBuilder = ({ layout, slug, sections, campaign }: Props) => {

    let html = ''

    if (campaign.data && sections && slug) {

        for (const section of sections) {
            // for paddings
            if (!(section.id in campaign.data)) {
                html += section.content
                continue
            }

            const sectionLayout = layout.find(item => item.section_id === section.id)
            if (!sectionLayout?.renderOn![slug]) {
                continue
            }
            let shift = 0
            const sectionPlaceholdersSort = section.placeholders?.toSorted((a, b) => a.position - b.position)
            const document = section.content.split("")
            const content = campaign.data[section.id] as { [key: string]: { [key: string]: string } }
            if (!content) continue
            const keys = Object.keys(content)
            if (!keys.length) continue
            // If data appears, placeholders also.
            for (const placeholder of sectionPlaceholdersSort!) {
                if (!(placeholder.id in content)) {
                    continue
                }

                if (!(slug in content[placeholder.id])) {
                    document.splice(placeholder.position + shift, 0, content[placeholder.id][placeholder.fallback])
                } else {
                    document.splice(placeholder.position + shift, 0, content[placeholder.id][slug])
                }
                shift++
            }

            html += document.join("")
        }
    }

    if (!campaign.data) {
        return (
            <div className='w-full flex items-center justify-center flex-col text-md font-semibold text-center md:text-3xl'>Looks like you don't have data <br /> to render.</div>
        )
    }

    if (!slug) {
        return (
            <div className='w-full flex items-center justify-center flex-col text-md font-semibold text-center md:text-3xl'>Please, select slug to render campaign</div>
        )
    }

    return (
        <div className="w-full flex flex-col gap-2 relative bg-slate-50 p-2">
            <NavbarBuilder html={html} campaign={campaign} />
            <iframe srcDoc={`<style>${campaign.css || ""}</style> ${html}`} className="h-full w-full">
            </iframe>
            {/* <div className='flex items-center justify-start flex-col' dangerouslySetInnerHTML={{ __html: campaign.css || "" }}></div>
                <div className='flex items-center justify-start flex-col' dangerouslySetInnerHTML={{ __html: html }}></div> */}
        </div>
    )
}

export default CampaignBuilder
