import { Digiflazz } from "./digiflazz";

export default function GetProductFromDigiflazz() {
  const digiflazz = new Digiflazz();
  const digi = digiflazz.GetProductList();
  console.log(digi);
}
