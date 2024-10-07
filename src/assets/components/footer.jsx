export function Footer() {

    return (
        <>
            <footer className="footer p-10 bg-neutral text-white">
                <aside>
                    <div className="flex items-center">
                        <img src="/img/logo.png" className="w-12 mr-2" />
                        <span className="text-primary font-bold text-3xl">MO</span>
                        <span className="text-white font-bold text-3xl ">TOO</span>
                    </div>
                    <p className="mt-4">PT Sinergi Informatika Semen Indonesia<br />Graha Aktiva, 11th Floor, Jl. H.R. Rasuna Said, Kav 3, South Jakarta, 12950  Indonesia</p>
                </aside>
                <nav>
                    <header className="footer-title">Services</header>
                    <a className="link link-hover">Branding</a>
                    <a className="link link-hover">Design</a>
                    <a className="link link-hover">Marketing</a>
                    <a className="link link-hover">Advertisement</a>
                </nav>
                <nav>
                    <header className="footer-title">Company</header>
                    <a className="link link-hover">About us</a>
                    <a className="link link-hover">Contact</a>
                    <a className="link link-hover">Jobs</a>
                    <a className="link link-hover">Press kit</a>
                </nav>
                <nav>
                    <header className="footer-title">Legal</header>
                    <a className="link link-hover">Terms of use</a>
                    <a className="link link-hover">Privacy policy</a>
                    <a className="link link-hover">Cookie policy</a>
                </nav>
            </footer>
            <footer className="footer px-10 py-4 bg-neutral text-white">
                <aside className="items-center grid-flow-col">

                    <p>Copyright © 2023 PT Sinergi Informatika Semen Indonesia</p>
                </aside>
               
            </footer>
        </>
    )
}