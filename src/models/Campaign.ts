type Campaign = {
    id: string
    userId: string
    title: string
    templateId: string
    template?: Template
    data: CampaignData
    layout: Layout[]
}
