import prisma from "@/prisma/client"

export const connectToDatabase=async()=>{
  try{
    await prisma.$connect();
  }catch(error){
    throw new Error("unable to connect to database");
  }
}