import { Link } from "react-router-dom"

const Navbar = () => {

    return (
        <div className="flex flex-col sm:flex-row gap-9 items-center justify-between p-9">
            <Link to="/" className="transition flex items-center gap-3 text-3xl">Marketplace</Link>   
        </div>
    )
}

export default Navbar