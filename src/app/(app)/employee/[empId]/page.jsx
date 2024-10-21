
import Dashboard from "@/components/empl_dashboard/Dashboard";


const Page = async ({ params }) => {
  const userId = params.empId;
  return (
    <div>
      <Dashboard userId={userId} />
    </div>
  );
};

export default Page;