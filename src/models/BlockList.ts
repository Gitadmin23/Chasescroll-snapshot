export type BlockList = {
    id: string;
    createdDate: number;
    lastModifiedDate: number;
     blockType: "CHAT"|"USER";
     typeID: string;
     blockObject: any;
}