import { Loader2 } from 'lucide-react'

const Spinner = ({ className = 'h-6 w-6 text-rose-600' }) => (
  <Loader2 className={`animate-spin ${className}`} />
)

export default Spinner
