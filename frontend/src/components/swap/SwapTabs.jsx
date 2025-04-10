import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import LockBuy from "./LockBuy";
import LockSell from "./LockSell";
import Unlock from "./Unlock";
import Retrieve from "./Retrieve";
import Decline from "./Decline";
import SecretGenerator from "./SecretGenerator";

const SwapTabs = () => {
  return (
    <Tabs defaultValue="lockBuy" className="w-full max-w-lg mx-auto">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="lockBuy">Buy</TabsTrigger>
        <TabsTrigger value="lockSell">Sell</TabsTrigger>
        {/* <TabsTrigger value="unlock">Unlock</TabsTrigger> */}
        <TabsTrigger value="retrieve">Retrieve</TabsTrigger>
        {/* <TabsTrigger value="decline">Decline</TabsTrigger> */}
        {/* <TabsTrigger value="secretGen">Secret</TabsTrigger> */}
      </TabsList>
      <TabsContent value="lockBuy">
        <LockBuy />
      </TabsContent>
      <TabsContent value="lockSell">
        <LockSell />
      </TabsContent>
      {/* <TabsContent value="unlock">
        <Unlock />
      </TabsContent> */}
      <TabsContent value="retrieve">
        <Retrieve />
      </TabsContent>
      {/* <TabsContent value="decline">
        <Decline />
      </TabsContent> */}
      {/* <TabsContent value="secretGen">
        <SecretGenerator />
      </TabsContent> */}
    </Tabs>
  );
};

export default SwapTabs; 