import { useParams } from "react-router-dom";
import { CustomerQueue } from "@/components/customer-queue";
import { DEFAULT_SHOP_ID } from "@/lib/queue";

const ShopQueue = () => {
  const { id } = useParams();

  return <CustomerQueue shopId={id || DEFAULT_SHOP_ID} />;
};

export default ShopQueue;