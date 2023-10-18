import ContainerCard from "./ContainerCard"
import Form from "./Form"

export default function requestTable(){


//     <td className="flex flex-row space-x-4 justify-center">
//     <button className="btn btn-success btn-sm" onClick={()=>document.getElementById('my_modal_2').showModal()}>
//         Approve
//     </button>
//     <button className="btn btn-error btn-sm">Deny</button>
// </td>

    const createRequestComponenet=(name, reason)=>{
        return(
            <tr>
                <th className="truncate">{name}</th>
                <td className="truncate">{reason}</td>
                <td className="flex flex-row space-x-4 justify-center">
                    <button className="btn btn-sm" onClick={()=>document.getElementById('my_modal_2').showModal()}>
                        Open
                    </button>
                </td>
                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box">
                        <ContainerCard isMin={true}>
                            <Form />
                        </ContainerCard>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>
            </tr>
        )      
    }
    
    return (
    <div className="overflow-x-auto flex flex-row justify-center ">
        <table className="table min-w-[900] w-11/12">
            <thead className="text-center">
            <tr>
                <th>Name</th>
                <th>Reason</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody className="text-center">
            {createRequestComponenet("Sahibpreet Singh", "I need to change my shift from 3-4 to 5-6")}
            </tbody>
        </table>
    </div>
    )
}