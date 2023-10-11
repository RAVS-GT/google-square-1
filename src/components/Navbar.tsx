import { useRouter } from "next/router";
import SideNav from "./SideNav";
import { useSessionStorage } from "usehooks-ts";
import { useClerk } from "@clerk/nextjs";


export default function Navbar() {
    const router=useRouter();
    const { signOut } = useClerk();

    const [, setOpen] = useSessionStorage("drawer", false);
    const toggleDrawer = () => setOpen((prev) => !prev);

    return (<div className="navbar bg-base-100">
    <div className="flex-none">
        <label htmlFor="my-drawer-2" className="btn btn-ghost btn-circle" onClick={toggleDrawer}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
    
    </div>
    <div className="flex-1">
      <a className="btn btn-ghost normal-case text-xl" onClick={()=>{router.push('/')}}>RAVS</a>
    </div>
    <div className="flex-none">
    <ul className="menu menu-horizontal px-1">
    <li><a onClick={() => signOut()}>Logout</a></li>
    </ul>
  </div>
  {/* <div className="dropdown dropdown-end"> */}
      {/* <label tabindex="0" class="btn btn-ghost btn-circle avatar">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
      </label>
      <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
        {/* <li>
          <a className="justify-between">
            Profile
            <span className="badge">New</span>
          </a>
        </li> */}
        {/* <li><a>Settings</a></li> */}
        {/* <li><a>Logout</a></li>
      </ul> */}
    {/* </div> */}
    {/* <div className="flex-none">
      <button className="btn btn-square btn-ghost">
      </button>
    </div> */}
  </div>)
}
