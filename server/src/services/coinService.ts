import User from "../models/User"

export const addCoins= async(userId:string, amount:number, reason:string)=>{

if(amount <= 0) throw  new Error("Amount must be positive")

const user=await User.findByIdAndUpdate(
    userId,
    {$inc:{coins:amount}},
    {new:true}
);

return user;
}


export const deductCoins = async (
  userId: string,
  amount: number,
  reason:string
) => {
  if (amount <= 0) throw new Error("Amount must be positive");

  const user = await User.findOneAndUpdate(
    { _id: userId, coins: { $gte: amount } }, //$gte is a MongoDB comparison operator.
    { $inc: { coins: -amount } },
    { new: true }
  );

  return user;
};

// $inc is a MongoDB update operator that increments (or decrements) a numeric field atomically.
// If amount is positive → it increases the value else decrease the value


