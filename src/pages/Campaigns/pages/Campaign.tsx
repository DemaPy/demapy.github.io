import Heading from "@/components/Heading"
import PageContainer from "@/components/PageContainer"
import { Edit, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import CampaignTemplateHandler from "./components/CampaignTemplateHandler"
import { useCampaignUpdateModal } from "@/store/campaignUpdateModal"
import UpdateCampaign from "../components/UpdateCampaign"
import { CampaignService } from "@/services/DI/Campaign"
import { useLayoutUpdate } from "@/store/layoutUpdate"

const Campaign = () => {
  const location = useLocation()
  const setOpen = useCampaignUpdateModal(state => state.setOpen)
  const setCampaignStore = useCampaignUpdateModal(state => state.setCampaign)
  const layout = useLayoutUpdate(state => state.layout)
  const params = useParams<{ id: string; }>()
  const [campaign, setCampaign] = useState<Campaign | null>()
  const navigate = useNavigate();
  if (!("id" in params)) return null
  
  useEffect(() => {
    (async () => {
      const response = await CampaignService.getOne(params.id!)
      if (response.error instanceof Error) {
        alert(response.message)
        return
      }
      if (response.data === null) {
        navigate("/campaigns")
        return
      }
      if (response.code === 401) {
        navigate(`/login?redirect=${location.pathname}`)
      }
      if (response.code === 403) {
        navigate(`/access-denied`)
      }
      setCampaign(response.data)
    })()
  }, [layout])

  if (!campaign) return null

  const handleDelete = async () => {
    const response = await CampaignService.delete(campaign.id!)
    if (response.status === "success") {
      navigate("/campaigns")
      return
    }
    console.error("Something went wrong", response)
  }

  const handleUpdate = () => {
    setCampaignStore(campaign)
    setOpen()
  }

  return (
    <PageContainer>
      <Heading
        title={campaign.title}
        action={{
          icon: <Trash className="w-4 h-4" />,
          onClick: handleDelete,
        }}
        actions={[
          {
            icon: <Edit className="w-4 h-4" />,
            onClick: handleUpdate,
          }
        ]}
      />
      <UpdateCampaign />
      <CampaignTemplateHandler campaign={campaign} />
    </PageContainer>
  )
}

export default Campaign