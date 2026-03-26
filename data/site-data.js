// ===== Cóc Sài Gòn - Site Data =====
// Tất cả nội dung website được quản lý tại đây

const DEFAULT_SITE_DATA = {
  // ===== GENERAL =====
  general: {
    siteName: "Cóc Sài Gòn",
    siteTagline: "Câu lạc bộ Truyền thông",
    logoUrl: "/assets/logo/logo.svg",
    description: "Câu lạc bộ Truyền thông Cóc Sài Gòn - CLB xuất sắc 7 năm liên tiếp tại trường Đại học FPT HCM.",
    socialLinks: {
      facebook: "#",
      instagram: "#",
      tiktok: "#",
      youtube: "#"
    }
  },

  // ===== NAV =====
  nav: [
    { label: "Trang chủ", href: "/" },
    { label: "Dự án", href: "/project" },
    { label: "Vinh danh", href: "/hall-of-fame" },
    { label: "Thành viên", href: "/member" },
    { label: "Ấn tượng", href: "/achievement" },
    { label: "Về Cóc", href: "/about" }
  ],

  // ===== HOME PAGE =====
  home: {
    hero: {
      banners: [
        { bgImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=800&fit=crop", link: "/project-detail?id=19th-birthday" },
        { bgImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1920&h=800&fit=crop", link: "/project-detail?id=ftalent" },
        { bgImage: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=800&fit=crop", link: "/project" }
      ]
    },
    diary: {
      title: "Nhật ký đời lính 2024",
      tag: "📖 Nhật ký",
      cardTitle: "NHẬT KÝ ĐỜI LÍNH 2024",
      cardDesc: "CSG vừa qua đã có một giai đoạn huấn luyện tiền quân sự vô cùng thú vị. Cùng xem lại những khoảnh khắc đáng nhớ trong chuyến đi lần này nhé!",
      cardImage: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=300&fit=crop"
    },
    gallery: {
      title: "Cóc đang là gì đây",
      items: [
        { image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=400&fit=crop", label: "CÓC SÀI GÒN 19th BIRTHDAY" },
        { image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=300&h=400&fit=crop", label: "Đặt tiền cho 2024" },
        { image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=400&fit=crop", label: "OPEN DAY" },
        { image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=300&h=400&fit=crop", label: "F-Talent Show" },
        { image: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=300&h=400&fit=crop", label: "Hội thao Cóc" },
        { image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=300&h=400&fit=crop", label: "Gala Night" }
      ]
    },
    stats: {
      title: "Những con số ấn tượng",
      items: [
        { number: 8, suffix: "", label: "Kỳ xuất sắc" },
        { number: 120, suffix: "+", label: "Dự án đã thực hiện" },
        { number: 50, suffix: "+", label: "Đối tác" },
        { number: 180, suffix: "+", label: "Thành viên" }
      ]
    },
    testimonials: {
      title: "Những lời nhận xét về Cóc Sài Gòn",
      items: [
        {
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
          name: "co.cotheiroon",
          role: "Cựu thành viên, Khóa 2019 - 2022",
          content: "Cóc Sài Gòn giúp mình tìm thấy đam mê, phát triển bản thân và kết nối với những người bạn tuyệt vời. Đây thực sự là nơi mà bạn có thể <strong>vượt qua giới hạn</strong> của chính mình.\n\nSẽ mãi biết ơn vì đã được là một phần của gia đình Cóc. 🐸💛"
        }
      ]
    }
  },

  // ===== PROJECTS =====
  projectCategories: [
    { id: "humans", name: "Humans Of FPTU", logo: "https://via.placeholder.com/100x60/1a1a1a/FFDE21?text=HUMANS" },
    { id: "flash", name: "Flash Beauty Moment", logo: "https://via.placeholder.com/100x60/1a1a1a/FFDE21?text=FLASH" },
    { id: "tiktok", name: "TikTok", logo: "https://via.placeholder.com/100x60/1a1a1a/FFDE21?text=TIKTOK" },
    { id: "doc", name: "Doc Online", logo: "https://via.placeholder.com/100x60/1a1a1a/FFDE21?text=DOC" },
    { id: "hpb", name: "HPB+", logo: "https://via.placeholder.com/100x60/1a1a1a/FFDE21?text=HPB" },
    { id: "hoc", name: "HoC", logo: "https://via.placeholder.com/100x60/1a1a1a/FFDE21?text=HoC" },
    { id: "cocsan", name: "Cóc Sân", logo: "https://via.placeholder.com/100x60/1a1a1a/FFDE21?text=COCSAN" },
    { id: "cocnang", name: "Cóc Năng Bổng", logo: "https://via.placeholder.com/100x60/1a1a1a/FFDE21?text=COCNANG" },
    { id: "music", name: "Music Tracking", logo: "https://via.placeholder.com/100x60/1a1a1a/FFDE21?text=MUSIC" }
  ],

  projects: [
    {
      id: "19th-birthday",
      title: "CÓC SÀI GÒN 19th BIRTHDAY",
      subtitle: "Beyond The Infinity",
      year: "2024",
      dateRange: "10/08/2024 - 15/09/2024",
      category: "event",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=500&fit=crop",
      description: "Kỷ niệm 19 năm thành lập CLB Cóc Sài Gòn - sự kiện lớn nhất trong năm với chủ đề Beyond The Infinity.",
      stats: { reach: "500.000+", interactions: "100.000+", attendees: "800+", participants: "200+" },
      gallery: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=400&fit=crop"
      ],
      featured: true,
      ongoing: true
    },
    {
      id: "dat-tien-2024",
      title: "ĐẶT TIỀN CHO 2024",
      subtitle: "Year End Show",
      year: "2024",
      dateRange: "01/12/2024 - 31/12/2024",
      category: "event",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=500&fit=crop",
      description: "Chương trình tổng kết cuối năm với những tiết mục đặc sắc.",
      stats: { reach: "200.000+", interactions: "50.000+" },
      gallery: [],
      featured: true,
      ongoing: true
    },
    {
      id: "flash-beauty-s3",
      title: "FLASH BEAUTY MOMENT SEASON 3",
      subtitle: "The Chosen One",
      year: "2024",
      monthYear: "05/2024",
      category: "flash",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=500&fit=crop",
      description: "Cuộc thi ảnh quy mô lớn mùa 3, chủ đề The Chosen One với hàng ngàn thí sinh tham dự.",
      stats: { reach: "783.366", interactions: "30.426", entries: "1.206+", contestants: "100" },
      milestones: [
        { label: "Khai mạc & Phát động", date: "15/04/2024" },
        { label: "Vòng Sơ khảo", date: "25/04/2024" },
        { label: "Vòng Đối đầu", date: "10/05/2024" },
        { label: "Chung kết & Trao giải", date: "25/05/2024" }
      ],
      link: "https://www.facebook.com/flashbeautymoment",
      gallery: [],
      featured: true
    },
    {
      id: "open-day",
      title: "OPEN DAY",
      subtitle: "Recruitment Event",
      year: "2024",
      monthYear: "09/2024",
      category: "event",
      image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop",
      description: "Sự kiện tuyển thành viên mới thường niên, nơi các bạn tân sinh viên tìm hiểu về mái nhà Cóc.",
      stats: { attendees: "500+" },
      gallery: [],
      featured: true,
      ongoing: false
    },
    {
      id: "f-talent",
      title: "F-TALENT SHOW",
      subtitle: "Talent Competition",
      year: "2024",
      category: "event",
      image: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=400&h=500&fit=crop",
      description: "Cuộc thi tìm kiếm tài năng lớn nhất sinh viên FPT.",
      stats: { reach: "900.000+", interactions: "200.000+", attendees: "1200", contestants: "345" },
      gallery: [],
      featured: true
    },
    {
      id: "trai-he-nang-vang",
      title: "Trại hè nắng vàng",
      subtitle: "Summer 2024",
      year: "2024",
      category: "event",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=500&fit=crop",
      description: "Trại hè truyền thống hàng năm của CLB.",
      stats: {},
      gallery: [],
      featured: false
    },
    {
      id: "huppoes",
      title: "HUPPOES",
      subtitle: "Spring 2024",
      year: "2024",
      category: "event",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=500&fit=crop",
      description: "Dự án mùa xuân 2024.",
      stats: {},
      gallery: [],
      featured: false
    },
    {
      id: "thay-coc",
      title: "Thầy Cốc",
      subtitle: "Fall 2024",
      year: "2024",
      category: "event",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=500&fit=crop",
      description: "Chương trình giao lưu thầy trò.",
      stats: {},
      gallery: [],
      featured: false
    },
    {
      id: "vong-tien",
      title: "Vọng Tiên",
      subtitle: "Fall 2023",
      year: "2023",
      category: "event",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=500&fit=crop",
      description: "Sự kiện văn hóa nghệ thuật.",
      stats: {},
      gallery: [],
      featured: false
    },
    {
      id: "love-off",
      title: "Love Off",
      subtitle: "2023",
      year: "2023",
      category: "event",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=500&fit=crop",
      description: "Chương trình giải trí 2023.",
      stats: {},
      gallery: [],
      featured: false
    },
    {
      id: "mong-du",
      title: "Mộng Du",
      subtitle: "2023",
      year: "2023",
      category: "event",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=500&fit=crop",
      description: "Đêm nhạc kịch nghệ thuật với concept độc đáo.",
      stats: { reach: "181.000+", interactions: "8992", attendees: "1000+", tickets: "568" },
      gallery: [],
      featured: false
    },
    {
      id: "lady-land",
      title: "Lady Land",
      subtitle: "2022",
      year: "2022",
      category: "event",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=500&fit=crop",
      description: "Sự kiện 2022.",
      stats: {},
      gallery: [],
      featured: false
    },
    {
      id: "flash-beauty-s1",
      title: "Flash Beauty Moment",
      subtitle: "Season 1",
      year: "2022",
      category: "flash",
      image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=400&h=500&fit=crop",
      description: "Cuộc thi ảnh mùa đầu tiên.",
      stats: {},
      gallery: [],
      featured: false
    },
    {
      id: "design-elite",
      title: "Design Elite Vietnam",
      subtitle: "2021",
      year: "2021",
      category: "event",
      image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=500&fit=crop",
      description: "Cuộc thi thiết kế quy mô.",
      stats: {},
      gallery: [],
      featured: false
    },
    // Category Projects (Permanent)
    {
      id: "humans",
      title: "Humans Of FPTU",
      subtitle: "Ghi lại những câu chuyện truyền cảm hứng",
      year: "Chuyên mục",
      category: "humans",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=1000&fit=crop",
      description: "Nơi lắng nghe và chia sẻ những câu chuyện, trải nghiệm sống đầy màu sắc của cộng đồng FPTU.",
      stats: { reach: "500k+", interactions: "50k+" },
      gallery: [],
      featured: false
    },
    {
      id: "flash",
      title: "Flash Beauty Moment",
      subtitle: "Khoảnh khắc rạng rỡ",
      year: "Chuyên mục",
      category: "flash",
      image: "https://images.unsplash.com/photo-1492691523567-6170c3295db6?w=800&h=1000&fit=crop",
      description: "Dự án hình ảnh chuyên biệt tôn vinh vẻ đẹp và phong cách của sinh viên FPT.",
      stats: { entries: "2000+", reach: "1M+" },
      gallery: [],
      featured: false
    },
    {
      id: "tiktok",
      title: "TikTok CSG",
      subtitle: "Nội dung ngắn sáng tạo",
      year: "Chuyên mục",
      category: "tiktok",
      image: "https://images.unsplash.com/photo-1611605698335-8b15d995cbfd?w=800&h=1000&fit=crop",
      description: "Kênh truyền thông video sáng tạo, bắt nhịp xu hướng và kết nối sinh viên.",
      stats: { followers: "20k+", likes: "500k+" },
      gallery: [],
      featured: false
    },
    {
      id: "doc",
      title: "Doc Online",
      subtitle: "Tin tức nhanh",
      year: "Chuyên mục",
      category: "doc",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=1000&fit=crop",
      description: "Chuyên mục bản tin và bài viết chia sẻ về đời sống học tập và giải trí tại FPTU.",
      stats: { reach: "300k+" },
      gallery: [],
      featured: false
    },
    {
      id: "hpb",
      title: "HPB+",
      subtitle: "Hỗ trợ học thuật",
      year: "Chuyên mục",
      category: "hpb",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=1000&fit=crop",
      description: "Dự án cộng đồng hỗ trợ sinh viên trong các kỳ thi và học tập chuyên môn.",
      stats: { participants: "5000+" },
      gallery: [],
      featured: false
    },
    {
      id: "hoc",
      title: "HoC (House of Coc)",
      subtitle: "Review đời sống sinh viên",
      year: "Chuyên mục",
      category: "hoc",
      image: "https://images.unsplash.com/photo-1518599904199-0ca897819ddb?w=800&h=1000&fit=crop",
      description: "Nơi chia sẻ những review chân thực và thú vị nhất về cuộc sống quanh khu Hòa Lạc.",
      stats: { reach: "200k+" },
      gallery: [],
      featured: false
    },
    {
      id: "cocsan",
      title: "Cóc Sân",
      subtitle: "Bản tin hàng tuần",
      year: "Chuyên mục",
      category: "cocsan",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=1000&fit=crop",
      description: "Tin tức tóm tắt và những sự kiện nóng hổi nhất dành riêng cho các thành viên Cóc Sài Gòn.",
      stats: { reach: "100k+" },
      gallery: [],
      featured: false
    },
    {
      id: "cocnang",
      title: "Cóc Năng Bổng",
      subtitle: "Góc học bổng",
      year: "Chuyên mục",
      category: "cocnang",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa1b424d?w=800&h=1000&fit=crop",
      description: "Chia sẻ kinh nghiệm săn học bổng và các cơ hội thăng tiến cho sinh viên.",
      stats: { participants: "1500+" },
      gallery: [],
      featured: false
    },
    {
      id: "music",
      title: "Music Tracking",
      subtitle: "Đồng hành cùng âm nhạc",
      year: "Chuyên mục",
      category: "music",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=1000&fit=crop",
      description: "Chuyên mục âm nhạc chia sẻ những playlist hay và những câu chuyện về nhạc sĩ, nghệ sĩ.",
      stats: { reach: "150k+" },
      gallery: [],
      featured: false
    }


  ],

  // ===== AWARDS (7-year Excellence) =====
  awards: [
    { id: "award-1", term: "SPRING & SUMMER 2019", title: "CLB Xuất Sắc", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=500&fit=crop" },
    { id: "award-2", term: "SPRING, SUMMER & FALL 2019", title: "CLB Xuất Sắc", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=500&fit=crop" },
    { id: "award-3", term: "FALL 2020", title: "CLB Xuất Sắc", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop" },
    { id: "award-4", term: "SPRING, SUMMER & FALL 2020", title: "CLB Xuất Sắc", image: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=400&h=500&fit=crop" },
    { id: "award-5", term: "SPRING & FALL 2021", title: "CLB Xuất Sắc", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=500&fit=crop" },
    { id: "award-6", term: "SPRING, SUMMER & FALL 2022", title: "CLB Xuất Sắc", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=500&fit=crop" },
    { id: "award-7", term: "SPRING, SUMMER & FALL 2023", title: "CLB Xuất Sắc", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=500&fit=crop" },
    { id: "award-8", term: "SPRING, SUMMER 2024", title: "CLB Xuất Sắc", image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=500&fit=crop" }
  ],

  // ===== DEPARTMENTS =====
  departments: [
    {
      id: "media",
      name: "Ban Media",
      subDepts: ["Content", "Design", "Photo", "Video"],
      description: "Ban Media bao gồm các bộ phận sản xuất nội dung truyền thông. Từ việc sáng tạo content, thiết kế đồ họa, chụp ảnh đến quay video, Ban Media đảm bảo chất lượng hình ảnh và nội dung cho toàn bộ CLB.",
      teams: [
        {
          name: "Team Content",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=350&fit=crop",
          members: [
            { name: "Trưởng ban nội dung", role: "Leader" },
            { name: "Nguyễn Văn A", role: "Member" },
            { name: "Trần Thị B", role: "Member" }
          ],
          description: "Team Content chịu trách nhiệm sáng tạo và quản lý nội dung trên các nền tảng truyền thông của CLB. Từ bài viết Facebook, caption Instagram đến kịch bản video, team luôn đảm bảo nội dung chất lượng và thu hút."
        },
        {
          name: "Team Design",
          image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&h=350&fit=crop",
          members: [
            { name: "Trưởng ban thiết kế", role: "Leader" },
            { name: "Lê Văn C", role: "Member" },
            { name: "Phạm Thị D", role: "Member" }
          ],
          description: "Team Design tạo ra các sản phẩm thiết kế đồ họa cho CLB, từ poster sự kiện, banner social media đến branding cho các dự án chuyên môn."
        },
        {
          name: "Team Photo",
          image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop",
          members: [
            { name: "Trưởng ban nhiếp ảnh", role: "Leader" },
            { name: "Hoàng Văn E", role: "Member" }
          ],
          description: "Team Photo ghi lại những khoảnh khắc đẹp nhất tại các sự kiện và hoạt động của CLB. Đội ngũ nhiếp ảnh luôn sẵn sàng với những bức ảnh chất lượng cao."
        },
        {
          name: "Team Video",
          image: "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=500&h=350&fit=crop",
          members: [
            { name: "Trưởng ban video", role: "Leader" },
            { name: "Ngô Thị F", role: "Member" }
          ],
          description: "Team Video sản xuất các video truyền thông, recap sự kiện, phóng sự và các nội dung video sáng tạo cho CLB."
        }
      ]
    },
    {
      id: "event",
      name: "Ban Event",
      subDepts: ["Planning", "Event Production", "Repair/Maint"],
      description: "Ban Event chịu trách nhiệm lên kế hoạch và tổ chức các sự kiện của CLB. Từ những buổi sinh hoạt nhỏ đến các sự kiện quy mô lớn hàng nghìn người tham gia.",
      teams: [
        {
          name: "Team Planning",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=350&fit=crop",
          members: [{ name: "Trưởng ban kế hoạch", role: "Leader" }],
          description: "Lên kế hoạch chi tiết cho các sự kiện."
        },
        {
          name: "Team Event Production",
          image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=350&fit=crop",
          members: [{ name: "Trưởng ban sản xuất", role: "Leader" }],
          description: "Triển khai và sản xuất sự kiện thực tế."
        }
      ]
    },
    {
      id: "er",
      name: "Ban ER",
      subDepts: ["Accounting", "HRS (Member service)", "Media", "B&D"],
      description: "Ban ER (External Relations) quản lý quan hệ đối ngoại, tìm kiếm tài trợ và hợp tác với các đối tác bên ngoài.",
      teams: [
        {
          name: "Team Accounting",
          image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=350&fit=crop",
          members: [{ name: "Kế toán trưởng", role: "Leader" }],
          description: "Quản lý tài chính của CLB."
        }
      ]
    },
    {
      id: "hr",
      name: "Ban HR",
      subDepts: ["Performance", "Morito"],
      description: "Ban HR (Human Resources) quản lý nhân sự, tuyển dụng thành viên mới và phát triển năng lực cho thành viên hiện tại.",
      teams: [
        {
          name: "Team Performance",
          image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=350&fit=crop",
          members: [{ name: "Trưởng nhân sự", role: "Leader" }],
          description: "Đánh giá hiệu suất và phát triển thành viên."
        }
      ]
    },
    {
      id: "malocee",
      name: "Ban MaloCee",
      subDepts: [],
      description: "Ban MaloCee là ban đặc biệt của CLB, chuyên phụ trách các hoạt động đặc thù và sáng tạo.",
      teams: []
    }
  ],

  // ===== ABOUT PAGE =====
  about: {
    quote: "CÂU LẠC BỘ TRUYỀN THÔNG DÀNH CHO NHỮNG NGƯỜI TRẺ ĐAM MÊ LĨNH VỰC TRUYỀN THÔNG, NƠI HỌ GẮN KẾT VÀ CÙNG NHAU TẠO NÊN NHỮNG GIÁ TRỊ TUYỆT VỜI CHO CỘNG ĐỒNG.",
    introText: "Cóc Sài Gòn là CLB Truyền thông trực thuộc trường Đại học FPT HCM, nơi quy tụ những sinh viên đam mê truyền thông, sáng tạo nội dung, thiết kế và tổ chức sự kiện. Được thành lập từ năm 2006, CLB đã phát triển thành một tổ chức chuyên nghiệp với hơn 180 thành viên hoạt động mỗi kỳ.",
    blocks: [
      {
        icon: "fas fa-university",
        title: "Thành lập",
        content: "Cóc Sài Gòn được thành lập năm 2006 bởi một nhóm sinh viên đam mê truyền thông tại FPT HCM. Qua 19 năm phát triển, CLB đã trở thành một trong những tổ chức lớn nhất và chuyên nghiệp nhất tại trường."
      },
      {
        icon: "fas fa-rocket",
        title: "Phát triển",
        content: "Từ một nhóm nhỏ, Cóc Sài Gòn đã phát triển thành tổ chức với 5 ban chuyên môn, hàng chục dự án mỗi năm và hơn 1000 cựu thành viên. CLB liên tục đổi mới và nâng cao chất lượng hoạt động."
      },
      {
        icon: "fas fa-binoculars",
        title: "Sứ mệnh",
        content: "Nơi quy tụ những sinh viên đam mê sáng tạo, cung cấp môi trường học tập thực tiễn và chuyên nghiệp trong lĩnh vực truyền thông."
      },
      {
        icon: "fas fa-gem",
        title: "Giá trị cốt lõi",
        content: "Sáng tạo - Đoàn kết - Phát triển - Chuyên nghiệp - Đam mê. Tinh thần Cóc là sự tự hào, kiên cường và luôn sẵn sàng cho thử thách."
      }
    ],
    benefits: {
      title: "NHỮNG ĐIỀU KHI TRỞ THÀNH MỘT CSG-ER CÓ THỂ NHẬN ĐƯỢC?",
      items: [
        {
          title: "Kỹ năng chuyên môn",
          description: "25 anh chị thành Cóc Sài Gòn kỳ dịp hiện đang công tác tại nhiều lĩnh vực khác nhau, sáng tự nhiên và đa dạng hoá các mối quan hệ, vốn kiến thức, kỹ năng truyền thông.",
          image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop"
        },
        {
          title: "Mối quan hệ & Trải nghiệm",
          description: "Trở thành CSG-er bạn sẽ có cơ hội kết nối hàng trăm mối quan hệ, các sự kiện networking và workshop từ các chuyên gia trong ngành truyền thông.",
          image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
        }
      ]
    }
  },

  // ===== HALL OF FAME =====
  hallOfFame: {
    individuals: {
      yearly: [
        {
          year: "2024",
          categories: [
            {
              name: "Cóc Vàng",
              members: [
                { recipient: "Ngô Sỹ Bảo Duy", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" }
              ]
            },
            {
              name: "Cóc Triển Vọng",
              members: [
                { recipient: "Cao Thị Hương Giang", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" }
              ]
            }
          ]
        },
        {
          year: "2023",
          categories: [
            {
              name: "Cóc Vàng",
              members: [
                { recipient: "Nguyễn Văn A", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face" }
              ]
            }
          ]
        }
      ],
      semesters: [
        {
          semester: "Spring 2024",
          categories: [
            {
              name: "Cóc Trắng",
              members: [
                { recipient: "Trần Thị B", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face" },
                { recipient: "Lê Minh C", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face" }
              ]
            }
          ]
        },
        {
          semester: "Fall 2023",
          categories: [
            {
              name: "Cóc Trắng",
              members: [
                { recipient: "Hoàng Văn D", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" }
              ]
            }
          ]
        }
      ]
    },
    collectives: {
      yearly: [
        {
          year: "2024",
          categories: [
            {
              name: "Dự án của năm",
              members: [
                { recipient: "Flash Beauty Moment S3", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop" }
              ]
            }
          ]
        }
      ],
      semesters: [
        {
          semester: "Spring 2024",
          categories: [
            {
              name: "Ban xuất sắc nhất",
              members: [
                { recipient: "Ban Media", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" }
              ]
            }
          ]
        },
        {
          semester: "Fall 2023",
          categories: [
            {
              name: "Ban xuất sắc nhất",
              members: [
                { recipient: "Ban Event", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop" }
              ]
            }
          ]
        }
      ]
    }
  },

  // ===== PRESIDENTS (CHỦ NHIỆM QUA CÁC THỜI KỲ) =====
  presidents: [
    { name: "Phạm Hữu Phát", gen: "Chủ nhiệm đời thứ 1", term: "2013 - 2014", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=400&fit=crop&crop=face" },
    { name: "Nguyễn Lê Minh", gen: "Chủ nhiệm đời thứ 2", term: "2014 - 2015", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face" },
    { name: "Trần Anh Tuấn", gen: "Chủ nhiệm đời thứ 3", term: "2015 - 2016", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face" },
    { name: "Lý Gia Hân", gen: "Chủ nhiệm đời thứ 4", term: "2016 - 2017", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face" },
    { name: "Ngô Sỹ Bảo Duy", gen: "Chủ nhiệm đời thứ n", term: "2023 - 2024", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face" }
  ],

  // ===== MEMBERS (BAN CHỦ NHIỆM CÁC CẤP) =====
  boardGenerations: [
    {
      term: "Kỳ gần nhất",
      members: [
        { name: "Ngô Sỹ Bảo Duy", role: "Chủ nhiệm CLB", gen: "GEN 19 | HK1 2024", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face" },
        { name: "Nguyễn Hoàng Đức Phương", role: "Trưởng ban sự kiện", gen: "GEN 18 | HK2 2023", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop&crop=face" },
        { name: "Cao Thị Hương Giang", role: "Trưởng ban nội dung", gen: "HK1 2024", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face" },
        { name: "Trương Hưng", role: "Trưởng ban thiết kế", gen: "GEN 19 | HK1 2024", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face" }
      ]
    },
    {
      term: "2023",
      members: [
        { name: "Trương Hoàng Phước", role: "Trưởng ban Nội dung", gen: "Gen 18", photo: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=400&fit=crop&crop=face" },
        { name: "Nguyễn Hồng Ngọc", role: "Phó ban Thiết kế", gen: "Gen 18", photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=400&fit=crop&crop=face" },
        { name: "Ngô Mỹ Ngọc", role: "Ban Sự kiện", gen: "Gen 18", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=400&fit=crop&crop=face" },
        { name: "Nguyễn Hải Đường", role: "Ban Truyền thông", gen: "Gen 18", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face" },
        { name: "Vũ Minh Trí", role: "Ban Hậu cần", gen: "Gen 18", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop&crop=face" }
      ]
    },
    {
      term: "2022",
      members: [
        { name: "Mai Thanh Phú", role: "Chủ nhiệm CLB", gen: "Gen 17", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=400&fit=crop&crop=face" },
        { name: "Nguyễn Ái Dĩ", role: "Trưởng ban Nội dung", gen: "Gen 17", photo: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=300&h=400&fit=crop&crop=face" },
        { name: "Nguyễn Ái Trúc", role: "Ban Thiết kế", gen: "Gen 17", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop&crop=face" }
      ]
    },
    {
      term: "2021",
      members: [
        { name: "Trần Minh", role: "Phó Chủ nhiệm", gen: "Gen 16", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop&crop=face" },
        { name: "Lê Phương", role: "Trưởng ban Sự kiện", gen: "Gen 16", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop&crop=face" }
      ]
    },
    {
      term: "2020",
      members: [
        { name: "Đoàn Hải", role: "Chủ nhiệm CLB", gen: "Gen 15", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=face" }
      ]
    }
  ],

  // ===== ACHIEVEMENTS =====
  awards: [
    { title: "CLB xuất sắc kỳ SPRING & SUMMER 2019", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=500&fit=crop" },
    { title: "CLB xuất sắc kỳ SPRING, SUMMER & FALL 2019", image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400&h=500&fit=crop" },
    { title: "CLB xuất sắc kỳ FALL 2020", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=500&fit=crop" },
    { title: "CLB xuất sắc kỳ SPRING, SUMMER & FALL 2020", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=500&fit=crop" },
    { title: "CLB xuất sắc kỳ SPRING & FALL 2021", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=500&fit=crop" },
    { title: "CLB xuất sắc kỳ SPRING, SUMMER & FALL 2022", image: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=400&h=500&fit=crop" },
    { title: "CLB xuất sắc kỳ SPRING, SUMMER & FALL 2023", image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=500&fit=crop" },
    { title: "CLB xuất sắc kỳ SPRING, SUMMER 2024", image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400&h=500&fit=crop" }
  ],

  // ===== HỆ SINH THÁI TRUYỀN THÔNG ĐA DẠNG =====
  mediaEcosystem: {
    totalFollowers: "130.000+",
    channels: [
      { name: "Fanpage Cóc Sài Gòn", logo: "https://via.placeholder.com/60x60/1a1a1a/f0f0f0?text=FB", followers: "85.000+", url: "https://facebook.com/cocsaigon" },
      { name: "Instagram Cóc Sài Gòn", logo: "https://via.placeholder.com/60x60/1a1a1a/f0f0f0?text=IG", followers: "15.000+", url: "https://instagram.com/cocsaigon" },
      { name: "TikTok Cóc Sài Gòn", logo: "https://via.placeholder.com/60x60/1a1a1a/f0f0f0?text=TK", followers: "25.000+", url: "https://tiktok.com/@cocsaigon" },
      { name: "YouTube Cóc Sài Gòn", logo: "https://via.placeholder.com/60x60/1a1a1a/f0f0f0?text=YT", followers: "5.000+", url: "https://youtube.com/@cocsaigon" }
    ]
  },

  // ===== SPONSORS =====
  sponsors: [
    { name: "KOTV", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=KOTV" },
    { name: "RuBy", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=RuBy" },
    { name: "Mons", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=Mons" },
    { name: "MixiGaming", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=MixiGaming" },
    { name: "KAPINT", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=KAPINT" },
    { name: "W Hotel", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=W+Hotel" },
    { name: "Heineken", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=Heineken" },
    { name: "H118", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=H118" },
    { name: "be", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=be" },
    { name: "UNIACE", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=UNIACE" },
    { name: "ImUnique", logo: "https://via.placeholder.com/120x60/1a1a1a/f0f0f0?text=ImUnique" }
  ],

  // ===== COLLABORATORS (ĐÃ HỢP TÁC CÙNG) =====
  collaborators: [
    { name: "Sơn Tùng M-TP", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
    { name: "Đen Vâu", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face" },
    { name: "Suboi", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face" },
    { name: "Karik", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
    { name: "Binz", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
    { name: "Hoàng Thùy Linh", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" }
  ],

  // ===== FOOTER =====
  footer: {
    description: "Câu lạc bộ Truyền thông Cóc Sài Gòn được thành lập tại trường Đại học FPT HCM.",
    address: "Đại học FPT, Tô Hiến Thành, Tân Phú, Thủ Đức City, HCMC",
    email: "csg.recruitment@gmail.com",
    phone: "090 714 4799 (Văn Ngọc – Ms.)",
    affiliates: [
      { name: "MaloCoc", description: "MaloCoc - Ban Hiệp ước Đối Ngoại thuộc CLB và là Truyền thông Cóc Sài Gòn.", email: "malococ@gmail.com", phone: "090 312 1234" }
    ],
    projectLinks: [
      { name: "Humans of FPTU", description: "Chuỗi phóng sự chân nhân dành cho sv FPTU.", email: "humansoffptu@gmail.com", phone: "033 308 4865", socialFb: "#" },
      { name: "Flash Beauty Moment", description: "Cuộc thi ảnh đẹp & flash mob đậm chất CLB.", email: "csg.flashbeautymoment@gmail.com", phone: "093 706 9971", socialFb: "#" },
      { name: "Humans Of Cóc Sài Gòn", description: "Chuỗi phóng sự chân dung – kể về mỗi một câu chuyện bất kỳ từ thành viên Ban Cóc Sài Gòn.", email: "csg.hocs@gmail.com", phone: "093 654 4789", socialFb: "#" }
    ],
    otherLinks: [
      { name: "Cóc Com F", description: "Cóc Com F – Giải cầu lông nội bộ Đại học FPT.", email: "csg.coccomf@gmail.com", phone: "090 891 4639", socialFb: "#", socialIg: "#" }
    ],
    competitions: [
      { name: "Cuộc thi F-Talent", description: "Là cuộc thi tìm kiếm và vinh danh những tài năng, bên cạnh đó mang đến nhiều hoạt động thú vị cho sinh viên Đại học FPT.", email: "ftalent.csg@gmail.com", phone: "033 908 5390" }
    ]
  }
};

export default DEFAULT_SITE_DATA;
