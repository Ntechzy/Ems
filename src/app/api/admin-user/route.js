// pages/api/admin.js
import dbconn from '@/lib/dbconn';
import employeeModel from '@/modal/employee';



export default async function handler(req) {
    dbconn()
  const adminUser = employeeModel.find(user => user.role === 'admin');
  return Response.json({ id: adminUser.id, name: adminUser.name });
}