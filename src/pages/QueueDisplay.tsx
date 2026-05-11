import { useParams } from "react-router-dom";
import { QueueDisplayScreen } from "@/components/queue-display-screen";
import { DEFAULT_SHOP_ID } from "@/lib/queue";

const QueueDisplay = () => {
  const { id } = useParams();

  return <QueueDisplayScreen shopId={id || DEFAULT_SHOP_ID} />;
};

export default QueueDisplay;