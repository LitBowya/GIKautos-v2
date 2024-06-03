import { useGetMechanicsQuery } from "../../slices/usersApiSlice"

const MechanicHomepage = () => {
    const { data: users, loading, error } = useGetMechanicsQuery()
    console.log(users)
  return (
    <div>MechanicHomePage</div>
  )
}

export default MechanicHomepage