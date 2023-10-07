// import useSWR from 'swr'
import Navbar from './Navbar'
import SideNav from './SideNav'
// import Footer from './footer'
 
export default function Layout({ children }) {
//   const { data, error } = useSWR('/api/navigation', fetcher)
 
//   if (error) return <div>Failed to load</div>
//   if (!data) return <div>Loading...</div>
 
  return (
    <>
      {/* <Navbar />
      <SideNav/>
      <main>{children}</main>
      <button className="btn btn-primary" onClick={()=>{}}>Cancel</button> */}

      <div className="drawer-content flex flex-col">
        <Navbar />
        {children}
      </div>

      {/* <Footer /> */}
    </>
  )
}