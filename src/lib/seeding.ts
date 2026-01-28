import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

const DEMO_EVENTS = [
    {
        title: "真冬のテントサウナ体験会！",
        category: "outdoor",
        description: "氷点下の湖畔で整いたい方募集。薪割りから火おこしまで一緒にやりましょう！",
        locationName: "本栖湖キャンプ場",
        locationArea: "山梨県",
        price: 2500,
        deposit: 50,
        capacity: 6,
        currentCount: 2,
        status: "recruiting",
        level: "初心者歓迎",
        tags: ["サウナ", "キャンプ", "冬キャンプ"],
        imageUrl: "https://images.unsplash.com/photo-1596435707700-032f2ec2084c?w=1200&q=80"
    },
    {
        title: "モルック日本代表（自称）との練習試合",
        category: "sports",
        description: "週末にゆったりモルックしましょう。初心者でもその場で教えます！",
        locationName: "代々木公園 中央広場",
        locationArea: "東京都",
        price: 500,
        deposit: 50,
        capacity: 12,
        currentCount: 4,
        status: "recruiting",
        level: "初心者歓迎",
        tags: ["モルック", "公園", "マイナースポーツ"],
        imageUrl: "https://images.unsplash.com/photo-1626027552271-e970a09e05ce?w=1200&q=80"
    },
    {
        title: "【電子工作】自作自立時計を作ろう",
        category: "monozukuri",
        description: "Raspberry Pi Picoを使って、自分好みのデジタル時計を作ります。ハンダ付け不要！",
        locationName: "秋葉原DMM.make AKIBA",
        locationArea: "東京都",
        price: 5000,
        deposit: 50,
        capacity: 4,
        currentCount: 1,
        status: "recruiting",
        level: "経験者向け",
        tags: ["テック", "DIY", "電子工作"],
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80"
    },
    {
        title: "ボードゲーム「テラフォーミング・マーズ」",
        category: "boardgame",
        description: "火星開拓をじっくりやりたい方。拡張版（プレリュード）込みで遊びます。",
        locationName: "新宿 ボドゲカフェ",
        locationArea: "東京都",
        price: 1500,
        deposit: 50,
        capacity: 5,
        currentCount: 3,
        status: "recruiting",
        level: "経験者向け",
        tags: ["ボドゲ", "重ゲー", "火星"],
        imageUrl: "https://images.unsplash.com/photo-1610819013583-6997842a6288?w=1200&q=80"
    }
];

export async function seedDemoData() {
    console.log("Seeding demo data...");
    const eventsRef = collection(db, "events");

    // Add 24h offset to startAt
    const now = new Date();

    for (const event of DEMO_EVENTS) {
        const start = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow
        const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // 3h later
        const deadline = new Date(start.getTime() - 12 * 60 * 60 * 1000); // 12h before start

        await addDoc(eventsRef, {
            ...event,
            startAt: Timestamp.fromDate(start),
            endAt: Timestamp.fromDate(end),
            deadlineAt: Timestamp.fromDate(deadline),
            createdAt: serverTimestamp(),
            hostId: "demo_host_system",
            hostName: "MONOs System",
        });
    }
    console.log("Seeding complete!");
}
