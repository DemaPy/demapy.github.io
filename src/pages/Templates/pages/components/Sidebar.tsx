import ListView from '@/components/List'
import Section from './Section'
import CreateSectionFromComponent from './CreateSectionFromComponent'
import CreateSection from './CreateSection'
import UpdateSection from './UpdateSection'
import CreatePlaceholder from '@/pages/Templates/pages/components/CreatePlaceholder'
import { useEffect, useState } from 'react'
import { ComponentService } from '@/services/DI/Component'
import { handleResponse } from '@/utils/handleResponse'
import { useLocation, useNavigate } from 'react-router-dom'

type Props = {
  sections: Section[] | null
  template_id: string
}

const Sidebar = ({ sections, template_id }: Props) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [components, setComponents] = useState<Component[] | null>(null)
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    (async () => {
      setLoading(true)
      const response = await ComponentService.getAll()
      const parsed = handleResponse<Component[]>(response, location, navigate)
      if (parsed) {
        setComponents(parsed.data)
      }
      setLoading(false)
    })()
  }, [])

  console.log(loading);
  
  return (
    <div className='w-3/4 relative max-h-[80vh] overflow-y-auto'>
      <div className='flex gap-2 items-center sticky top-2'>
        <CreateSection template_id={template_id} />
        {components && components.length > 0 && (
          <CreateSectionFromComponent template_id={template_id} components={components} />
        )}
      </div>
      <UpdateSection />
      <CreatePlaceholder />
      <ListView component={Section} items={sections} />
    </div>
  )
}

export default Sidebar