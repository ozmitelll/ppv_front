const Footer = () =>{
    return (
        <div className="dark bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-center">
                <p className="mt-4 md:mt-0 text-sm text-gray-300 text-center">© {new Date().getFullYear()} Антонюк Продкшн, всі права захищені!</p>
            </div>
        </div>
    )
}

export default Footer