import mongoose from "mongoose";
import Destination from "../models/Destination";

const destinations = [
  {
    name: { vi: "Ma Ú", en: "Ma U" },
    slug: "ma-u",
    type: "nature",
    images: [],
    shortDescription: { vi: "Bản làng vùng cao hoang sơ.", en: "A pristine highland village." },
    description: { vi: "Ma Ú là một bản làng vùng cao nổi tiếng với cảnh sắc thiên nhiên tuyệt đẹp.", en: "Ma U is a famous highland village with beautiful natural scenery." },
    location: { lat: 23.0, lng: 105.0, address: { vi: "Ma Ú, Hà Giang", en: "Ma U, Ha Giang" } },
    detail: { fullDescription: { vi: "Ma Ú là điểm đến lý tưởng cho những ai yêu thích trekking và khám phá văn hóa bản địa.", en: "Ma U is an ideal destination for those who love trekking and exploring local culture." } },
    relatedTours: []
  },
  {
    name: { vi: "Rừng Thiên Hương cổ thụ", en: "Ancient Thien Huong Forest" },
    slug: "rung-thien-huong",
    type: "forest",
    images: [],
    shortDescription: { vi: "Khu rừng nguyên sinh nổi tiếng.", en: "A famous primeval forest." },
    description: { vi: "Rừng Thiên Hương cổ thụ là nơi lý tưởng cho các chuyến trekking khám phá thiên nhiên.", en: "Ancient Thien Huong Forest is an ideal place for nature trekking trips." },
    location: { lat: 23.1, lng: 105.1, address: { vi: "Thiên Hương, Hà Giang", en: "Thien Huong, Ha Giang" } },
    detail: { fullDescription: { vi: "Rừng có hệ sinh thái đa dạng và cảnh quan tuyệt đẹp.", en: "The forest has a diverse ecosystem and beautiful landscapes." } },
    relatedTours: []
  },
  {
    name: { vi: "Hang Tả Lủng", en: "Hang Ta Lung" },
    slug: "hang-ta-lung",
    type: "cave",
    images: [],
    shortDescription: { vi: "Hang động kỳ bí ở Hà Giang.", en: "A mysterious cave in Ha Giang." },
    description: { vi: "Hang Tả Lủng nổi bật với các khối đá và thạch nhũ độc đáo.", en: "Hang Ta Lung features unique rock formations and stalactites." },
    location: { lat: 23.2, lng: 105.2, address: { vi: "Tả Lủng, Hà Giang", en: "Ta Lung, Ha Giang" } },
    detail: { fullDescription: { vi: "Điểm đến hấp dẫn cho du khách thích khám phá hang động.", en: "An attractive destination for cave explorers." } },
    relatedTours: []
  },
  {
    name: { vi: "Hố Sụt Sủng Là", en: "Ho Sut Sung La" },
    slug: "ho-sut-sung-la",
    type: "sinkhole",
    images: [],
    shortDescription: { vi: "Hiện tượng tự nhiên độc đáo.", en: "A unique natural phenomenon." },
    description: { vi: "Hố sụt là điểm đến thú vị cho những ai yêu thích địa chất.", en: "The sinkhole is an interesting destination for geology lovers." },
    location: { lat: 23.3, lng: 105.3, address: { vi: "Sủng Là, Hà Giang", en: "Sung La, Ha Giang" } },
    detail: { fullDescription: { vi: "Khám phá hiện tượng sụt đất và cảnh quan xung quanh.", en: "Explore the sinkhole phenomenon and surrounding landscapes." } },
    relatedTours: []
  },
  {
    name: { vi: "Sông Nho Quế", en: "Nho Que River" },
    slug: "song-nho-que",
    type: "river",
    images: [],
    shortDescription: { vi: "Dòng sông nổi tiếng ở Hà Giang.", en: "A famous river in Ha Giang." },
    description: { vi: "Sông Nho Quế nổi bật với màu nước xanh biếc và cảnh quan hùng vĩ.", en: "Nho Que River is famous for its emerald water and majestic scenery." },
    location: { lat: 23.4, lng: 105.4, address: { vi: "Sông Nho Quế, Hà Giang", en: "Nho Que River, Ha Giang" } },
    detail: { fullDescription: { vi: "Điểm đến lý tưởng cho các hoạt động du lịch sinh thái và trải nghiệm thuyền kayak.", en: "An ideal destination for eco-tourism and kayaking experiences." } },
    relatedTours: []
  },
  {
    name: { vi: "Vách Đá Trắng", en: "White Cliff" },
    slug: "vach-da-trang",
    type: "mountain",
    images: [],
    shortDescription: { vi: "Vách đá nổi tiếng với cảnh quan hùng vĩ.", en: "A famous cliff with majestic scenery." },
    description: { vi: "Vách Đá Trắng là điểm check-in hấp dẫn cho du khách trẻ.", en: "White Cliff is a popular check-in spot for young travelers." },
    location: { lat: 23.5, lng: 105.5, address: { vi: "Vách Đá Trắng, Hà Giang", en: "White Cliff, Ha Giang" } },
    detail: { fullDescription: { vi: "Chinh phục vách đá và ngắm toàn cảnh thung lũng.", en: "Conquer the cliff and enjoy panoramic valley views." } },
    relatedTours: []
  },
  {
    name: { vi: "Mã Pì Lèng", en: "Ma Pi Leng Pass" },
    slug: "ma-pi-leng",
    type: "mountain-pass",
    images: [],
    shortDescription: { vi: "Một trong tứ đại đỉnh đèo Việt Nam.", en: "One of Vietnam's four great mountain passes." },
    description: { vi: "Mã Pì Lèng nổi tiếng với cung đường đèo hiểm trở và cảnh sắc ngoạn mục.", en: "Ma Pi Leng is famous for its rugged pass and breathtaking scenery." },
    location: { lat: 23.6, lng: 105.6, address: { vi: "Mã Pì Lèng, Hà Giang", en: "Ma Pi Leng, Ha Giang" } },
    detail: { fullDescription: { vi: "Địa điểm không thể bỏ qua khi đến Hà Giang.", en: "A must-visit spot when coming to Ha Giang." } },
    relatedTours: []
  },
  {
    name: { vi: "Cao nguyên đá Đồng Văn", en: "Dong Van Karst Plateau" },
    slug: "cao-nguyen-da-dong-van",
    type: "plateau",
    images: [],
    shortDescription: { vi: "Di sản địa chất toàn cầu UNESCO.", en: "UNESCO Global Geopark." },
    description: { vi: "Cao nguyên đá Đồng Văn nổi bật với cảnh quan đá vôi và văn hóa dân tộc đặc sắc.", en: "Dong Van Karst Plateau stands out with limestone landscapes and unique ethnic culture." },
    location: { lat: 23.7, lng: 105.7, address: { vi: "Đồng Văn, Hà Giang", en: "Dong Van, Ha Giang" } },
    detail: { fullDescription: { vi: "Khám phá di sản địa chất và văn hóa bản địa.", en: "Explore geological heritage and local culture." } },
    relatedTours: []
  }
];

async function seed() {
  await mongoose.connect("mongodb://localhost:27017/hagiangtravel");
  await Destination.deleteMany({});
  await Destination.insertMany(destinations);
  await mongoose.disconnect();
  console.log("Seeded destinations!");
}

seed(); 