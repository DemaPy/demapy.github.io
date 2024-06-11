import Title from "@/components/Title"
import { Link } from "react-router-dom"

type Props = {
  item: Template
}

const ComponentCard = ({ item }: Props) => {
  return (
    <div className="p-2 border rounded-md">
      <Link to={"/components/" + item.id}>
        <Title size="sm" title={item.title} />
      </Link>
    </div>
  )
}

export default ComponentCard