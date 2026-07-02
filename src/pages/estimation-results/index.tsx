import CalculationWithMaterial from "./components/CalculationWithMaterial";
import PaintArea from "./components/PaintArea";
import PaintSummary from "./components/PaintSummary";
import Period from "./components/Period";
import PriceConfig from "./components/PriceConfig";
import UserInfo from "./components/UserInfo";

export default function EstimationResult() {
  return (
    <div className="flex flex-col gap-2.5">
      <PriceConfig />
      <CalculationWithMaterial />
      <Period />
      <PaintArea />
      <PaintSummary />
      <UserInfo />
    </div>
  );
}
