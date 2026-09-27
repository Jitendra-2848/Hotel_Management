import Razorpay from "razorpay";

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY || "rzp_test_Tb88mvkOpORfnP",
  key_secret: process.env.RAZORPAY_SECRET || "Ad238aSV74YpxEhGfrS226D7",
});

export default razorpay;