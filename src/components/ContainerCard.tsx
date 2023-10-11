type Props = {
    children: React.ReactNode;
    isMin?: boolean;
  };

export default function ContainerCard({children, isMin}:Props) {
    if(isMin)
    return(
        <div className="flex flex-row justify-center">
            <div className={"shadow-md pb-10 pt-5 rounded-md px-5 mx-4 min-h-min"}>
                {children}
            </div>
        </div>
    )

    return(

            <div className={"shadow-md pb-10 pt-5 rounded-md px-5 mx-4 min-h-min "}>
                {children}
            </div>

    )
}

