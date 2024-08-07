import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

type Props = {
    onSelect: (slug: string | null) => void
    csv: any[] | null
}

const SelectCSV = ({ csv, onSelect }: Props) => {

    const handleClick = (column: string) => {
        onSelect(column)
    }

    useEffect(() => {

        return () => {
            onSelect(null)
        }
    }, [])

    if (!csv) return

    return (
        <ul className='flex flex-col gap-2'>
            {csv.map((item, idx) => <li key={idx} className='flex justify-between items-center text-sm font-semibold'>{item} <Button size={"sm"} onClick={() => handleClick(item)}>Select</Button></li>)}
        </ul>
    )
}

export default SelectCSV