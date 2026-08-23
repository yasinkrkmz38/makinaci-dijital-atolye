'use strict';

const REVISION_DATE='2026-08-23';

const calculatorSeo={
  'iso-286-tolerans':{
    slug:'iso-286-tolerans',
    name:'ISO 286 Tolerans ve Geçme Hesaplayıcı',
    title:'ISO 286 Tolerans Hesaplama | H7, g6, h6 Geçmeler',
    description:'ISO 286 delik ve mil toleranslarını hesaplayın; H7/g6, H7/h6, H7/p6 için limit ölçüleri, boşluk ve sıkılık sonucunu görün.',
    intro:'Nominal ölçü ile delik ve mil tolerans bölgesini seçin; alt-üst limitleri ve oluşan geçme türünü mikrometre cinsinden hesaplayın.',
    standard:'ISO 286-1 ve ISO 286-2',
    sections:[
      {heading:'ISO 286 tolerans hesabı neyi gösterir?',paragraphs:[
        'ISO 286 sistemi, silindirik parçaların delik ve mil ölçülerini ortak bir tolerans diliyle tanımlar. H7, g6 veya p6 gibi bir gösterimde harf tolerans bölgesinin sıfır çizgisine göre konumunu, sayı ise tolerans kalitesini ifade eder. Hesaplayıcı seçilen nominal çapa göre delik ve milin kabul edilebilir en küçük ve en büyük ölçülerini gösterir.',
        'İki parçanın limit ölçüleri karşılaştırıldığında en küçük ve en büyük boşluk hesaplanır. Her iki sonuç pozitifse boşluklu geçme, her ikisi negatifse sıkı geçme, işaret değişiyorsa geçiş geçmesi oluşur. Bu sınıflandırma; yataklama, konumlama, presleme ve sökülebilir bağlantı kararlarında ilk kontrol noktasıdır.'
      ]},
      {heading:'H7/g6, H7/h6 ve H7/p6 nasıl seçilir?',paragraphs:[
        'H7/g6 genellikle kontrollü boşluk ve rahat montaj istenen uygulamalarda değerlendirilir. H7/h6 düzeninde milin üst sapması sıfır çizgisine yaklaşır; boşluk daha sınırlı olabilir. H7/p6 ise pres veya sıkı geçme gerektiren bağlantılarda gündeme gelir. Gerçek seçim yalnızca tolerans koduna göre yapılmamalı; yük, sıcaklık, malzeme, yüzey kalitesi, kaplama ve sökme ihtiyacı birlikte değerlendirilmelidir.'
      ],bullets:['Nominal ölçüyü bitmiş parça çapı olarak girin.','Delik ve mil kodlarını teknik resimdeki sırayla seçin.','Sonucu ölçüm cihazının çözünürlüğü ve proses yeterliliğiyle karşılaştırın.','Kritik bağlantılarda güncel standart tablosu ve tasarım sorumlusu onayı kullanın.']},
      {heading:'Örnek: 50 mm H7/g6 geçme',paragraphs:[
        'Nominal çap 50 mm, delik H7 ve mil g6 seçildiğinde araç iki parçanın limitlerini ayrı ayrı hesaplar ve olası boşluk aralığını verir. Ölçüm planında yalnızca nominal değer değil, her parçanın alt ve üst kabul sınırı kullanılmalıdır. Seri üretimde ölçüm sonuçlarını proses yeterlilik analiziyle izlemek, tek bir uygun parça ölçmekten daha güvenilir bir kontrol sağlar.'
      ]},
      {heading:'Hesap sonucunu kullanırken dikkat',paragraphs:[
        'Bu araç hızlı ön değerlendirme içindir. Büyük çaplar, özel tolerans bölgeleri, sıcaklık farkları, kaplama kalınlığı veya standart dışı malzemeler için mühendislik hesabı genişletilmelidir. Teknik resim ve müşteri şartnamesi her zaman genel hesap sonucundan önce gelir.'
      ]}
    ],
    faq:[
      {question:'H7 toleransındaki H ne anlama gelir?',answer:'Büyük H delik esaslı sistemi ifade eder ve deliğin alt sapması sıfır kabul edilir. Tolerans genişliği nominal çap ve kalite numarasına göre değişir.'},
      {question:'Negatif boşluk ne demektir?',answer:'Milin delikten büyük olduğu olası aralığı gösterir. Bu durum sıkı veya geçiş geçmesine işaret eder ve montaj kuvveti ya da sıcaklık yöntemi gerektirebilir.'},
      {question:'Hesap makinesi teknik resim yerine geçer mi?',answer:'Hayır. Sonuç ön kontrol içindir; güncel ISO 286 tablosu, teknik resim ve tasarım şartlarıyla doğrulanmalıdır.'}
    ],
    relatedArticles:['iso-286-h7-g6-gecme-rehberi','kaplin-hizalama-uygulama-rehberi']
  },
  'kilavuz-on-delik':{
    slug:'kilavuz-on-delik',
    name:'Metrik, UNC ve UNF Kılavuz Ön Delik Hesaplayıcı',
    title:'Kılavuz Ön Delik Çapı | Metrik, UNC ve UNF Tablosu',
    description:'M2–M30 metrik ile yaygın UNC ve UNF dişler için kılavuz ön delik çapını, anma çapını ve diş adımını hızlıca hesaplayın.',
    intro:'Diş standardını ve ölçüyü seçerek pratik kılavuz matkap çapını, anma çapını ve adımı milimetre cinsinden görün.',
    standard:'ISO 724, ISO 965 ve ASME B1.1',
    sections:[
      {heading:'Kılavuz ön delik çapı neden önemlidir?',paragraphs:[
        'Ön delik çok küçük seçilirse kılavuz torku yükselir, talaş sıkışması ve takım kırılması riski artar. Delik fazla büyük olduğunda ise diş doluluğu ve taşıma alanı azalır. Doğru çap; malzeme, diş adımı, istenen diş yüzdesi, delik derinliği ve kullanılan kesme ya da form kılavuzuna göre belirlenmelidir.',
        'Hızlı yaklaşımda metrik ve inç dişler için anma çapından adım çıkarılır. Hesaplayıcı bu pratik kuralı uygular ve sonucu milimetreye çevirir. Üretim kararı verirken kılavuz üreticisinin tablosu daha ayrıntılı diş yüzdesi ve malzeme önerileri sağlar.'
      ]},
      {heading:'Kesme kılavuzu ve form kılavuzu farkı',paragraphs:[
        'Kesme kılavuzu talaş kaldırdığı için hesaplanan klasik ön delik değerleriyle çalışır. Form kılavuzu malzemeyi plastik olarak şekillendirir ve çoğunlukla daha büyük bir ön delik ister. Aynı M8 ölçüsünde bile takım türünü değiştirmeden önce delik çapı yeniden doğrulanmalıdır.'
      ],bullets:['Kör delikte talaş ve dip payı bırakın.','Paslanmaz ve yapışkan malzemelerde uygun kesme sıvısı kullanın.','Form kılavuzunda üreticinin önerdiği özel delik çapını seçin.','Matkap salgısını ve gerçek delik çapını ölçün.']},
      {heading:'M6 ve M8 için yaygın örnek',paragraphs:[
        'M6×1 dişte pratik başlangıç değeri yaklaşık 5,0 mm, M8×1,25 dişte yaklaşık 6,75 mm olur. Standart matkap serisine, kaplama ve malzemeye göre en yakın uygun çap seçilir. Hassas seri üretimde yalnızca matkap nominaline güvenmek yerine delik mastarı veya ölçüm sistemiyle gerçek çap kontrol edilmelidir.'
      ]},
      {heading:'UNC ve UNF ölçülerini okuma',paragraphs:[
        '1/4-20 UNC gösteriminde ilk değer anma çapını, 20 ise inç başına diş sayısını belirtir. UNF aynı anma çapında daha fazla diş içerir ve adımı daha küçüktür. Araç inç başına diş sayısını milimetre adıma dönüştürerek ortak bir ön delik hesabı verir.'
      ]}
    ],
    faq:[
      {question:'M6 kılavuz için kaçlık matkap kullanılır?',answer:'M6×1 kesme kılavuzu için yaygın başlangıç değeri 5,0 mm’dir. Malzeme, tolerans ve takım üreticisi önerisiyle doğrulayın.'},
      {question:'Form kılavuzunda aynı ön delik kullanılır mı?',answer:'Genellikle hayır. Form kılavuzu malzemeyi şekillendirdiği için kesme kılavuzundan daha büyük ön delik gerektirir.'},
      {question:'UNC ve UNF arasındaki fark nedir?',answer:'UNC kaba, UNF ince diş serisidir. Aynı anma çapında UNF daha küçük adım ve daha fazla diş sayısına sahiptir.'}
    ],
    relatedArticles:['kilavuz-on-delik-secimi-metrik-unc-unf','cnc-devir-ilerleme-hesabi']
  },
  'cnc-kesme':{
    slug:'cnc-kesme',
    name:'CNC Devir ve İlerleme Hesaplayıcı',
    title:'CNC Devir ve İlerleme Hesaplama | Torna ve Freze',
    description:'Malzeme, takım türü ve çapa göre CNC torna/freze devrini, kesme hızını, diş başı ilerlemeyi ve tezgâh ilerlemesini hesaplayın.',
    intro:'Operasyon, iş parçası malzemesi, takım, çap ve diş sayısına göre güvenli başlangıç devri ile ilerleme değerlerini hesaplayın.',
    standard:'ISO 3002 terminolojisi ve takım üreticisi kesme verileri',
    sections:[
      {heading:'CNC devir hesabının temeli',paragraphs:[
        'İş mili devri; kesme hızı, takım veya iş parçası çapı ve pi sayısı kullanılarak hesaplanır. Çap küçüldükçe aynı kesme hızını korumak için devir yükselir. Frezelemede tezgâh ilerlemesi devir, diş sayısı ve diş başı ilerlemenin çarpımıdır. Tornada ilerleme çoğunlukla milimetre/devir olarak tanımlanır.',
        'Araç; yapı çeliği, paslanmaz, alüminyum ve dökme demir için karbür veya HSS başlangıç verileri sunar. Bunlar kesin katalog değeri değildir. Takım kalitesi, kaplama, bağlama rijitliği, çıkıntı, soğutma ve tezgâh gücü sonucu önemli ölçüde değiştirir.'
      ]},
      {heading:'Freze ilerlemesi nasıl ayarlanır?',paragraphs:[
        'İlk hesaplamadan sonra takım üreticisinin önerdiği aralıkla karşılaştırma yapılır. Uzun takım çıkıntısı, zayıf bağlama veya ince cidarlı parçada diş başı ilerleme azaltılabilir. Ancak ilerlemeyi aşırı düşürmek takımın kesmek yerine sürtünmesine, ısı ve erken aşınmaya yol açabilir.'
      ],bullets:['Takım çapı ve gerçek kesici diş sayısını doğru girin.','Tezgâhın azami devrini ve ilerlemesini aşmayın.','İlk parçayı düşük yükte gözlemleyip talaş biçimini kontrol edin.','Titreşim varsa yalnızca ilerlemeyi değil bağlama ve çıkıntıyı da düzeltin.']},
      {heading:'Tornalamada başlangıç değeri',paragraphs:[
        'Tornalamada çap iş parçasının kesilen bölgesindeki gerçek çaptır. Dış çap küçüldükçe sabit kesme hızı için devir artar. Punta, ayna sıkma kuvveti, parça boyu ve dengesiz kütle güvenli devir sınırını belirleyebilir; hesaplanan değer tezgâh veya bağlama sınırından yüksekse düşük sınır kullanılmalıdır.'
      ]},
      {heading:'Sonuçların sahada doğrulanması',paragraphs:[
        'Talaş rengi ve şekli, takım sesi, yüzey kalitesi, iş mili yükü ve ölçü kararlılığı birlikte izlenmelidir. Takım ömrü verisi iş emri veya üretim kaydıyla tutulursa sonraki işler için işletmeye özel güvenilir bir kesme veri tabanı oluşur.'
      ]}
    ],
    faq:[
      {question:'Devir yüksek çıkarsa ne yapılmalı?',answer:'Tezgâh, bağlama veya takımın izin verdiği en düşük güvenli sınırı kullanın ve kesme hızını buna göre yeniden değerlendirin.'},
      {question:'Freze ilerlemesinde kaç diş girilir?',answer:'Aynı anda kesmeye katılması beklenen takımın etkin kesici diş sayısı girilir. Kırık veya devre dışı kesici varsa hesaba katmayın.'},
      {question:'HSS ve karbür aynı kesme hızını kullanır mı?',answer:'Hayır. Karbür takımlar çoğunlukla HSS’den daha yüksek kesme hızlarında çalışır; kesin değer üretici kataloğundan alınmalıdır.'}
    ],
    relatedArticles:['cnc-devir-ilerleme-hesabi','cnc-koruyucu-bakim-kontrol-listesi']
  },
  'rulman-kod':{
    slug:'rulman-kod',
    name:'Rulman Kod Çözücü',
    title:'Rulman Kodu Okuma | 6205, 2RS, ZZ, C3 Açıklaması',
    description:'6205, 6308 gibi rulman kodlarından seri ve iç çapı; 2RS, ZZ, C3, P5, K ve NR soneklerinin anlamını hızlıca öğrenin.',
    intro:'Temel rulman kodunu girerek seri, yaklaşık delik çapı, kapak, conta, boşluk ve hassasiyet soneklerini açıklayın.',
    standard:'ISO 15, ISO 492, ISO 5753-1 ve üretici katalogları',
    sections:[
      {heading:'Rulman kodu nasıl okunur?',paragraphs:[
        'Yaygın sabit bilyalı rulmanlarda 60, 62 ve 63 gibi ilk rakamlar boyut serisini; son iki rakam ise çoğu standart ölçüde delik kodunu gösterir. Delik kodu 04 ve üzerindeyse beş ile çarpılarak yaklaşık iç çap bulunur. 00, 01, 02 ve 03 kodları sırasıyla 10, 12, 15 ve 17 mm özel değerlerine karşılık gelir.',
        'Kodun sonundaki işaretler kapak, conta, iç boşluk, hassasiyet veya konik delik gibi özellikleri belirtir. Aynı işaretin ayrıntılı anlamı üreticiler arasında küçük farklılıklar gösterebilir; sipariş öncesi üretici kataloğu doğrulanmalıdır.'
      ]},
      {heading:'2RS, ZZ ve C3 ne anlama gelir?',paragraphs:[
        '2RS ailesi genellikle iki tarafta elastomer conta, ZZ veya 2Z ise iki tarafta metal kapak bulunduğunu ifade eder. Conta kir girişine karşı daha güçlü koruma sağlayabilir fakat sürtünme ve hız sınırını etkiler. C3, normal grubun üzerinde iç radyal boşluk seçildiğini belirtir ve sıcaklık ya da sıkı geçme nedeniyle çalışma boşluğu azalacak uygulamalarda değerlendirilebilir.'
      ],bullets:['2RS/2RSH/2RSR: iki taraflı temaslı veya düşük sürtünmeli conta ailesi.','ZZ/2Z: iki taraflı metal kapak.','C3/C4: normalden büyük iç boşluk grupları.','P5: yükseltilmiş hassasiyet sınıfı.','K: konik delik; N/NR: segman kanalı seçenekleri.']},
      {heading:'Doğru rulman seçimi yalnızca koda bağlı değildir',paragraphs:[
        'Yük yönü ve büyüklüğü, devir, çalışma sıcaklığı, yağlama, kirlenme, mil-yatak geçmesi ve hedef ömür birlikte değerlendirilmelidir. Eski rulmanın kodunu aynen kopyalamak, arızanın kök nedeni yanlış seçim veya çalışma koşuluysa problemi tekrar ettirebilir.'
      ]},
      {heading:'Bakım kaydında hangi bilgiler tutulmalı?',paragraphs:[
        'Rulman kodu yanında üretici, montaj tarihi, yağlayıcı, çalışma saati, titreşim ve sıcaklık trendi kaydedilmelidir. Sökülen rulmanın hasar görüntüsü ile arıza sınıfı ilişkilendirildiğinde sonraki bakım periyodu daha güvenilir belirlenir.'
      ]}
    ],
    faq:[
      {question:'6205 rulmanın iç çapı kaçtır?',answer:'Son iki rakam 05 olduğundan standart kurala göre 5 × 5 = 25 mm iç çap elde edilir.'},
      {question:'2RS ile ZZ aynı mıdır?',answer:'Hayır. 2RS genellikle elastomer conta, ZZ veya 2Z metal kapak anlamına gelir; sürtünme ve sızdırmazlık davranışları farklıdır.'},
      {question:'C3 rulman her yerde kullanılabilir mi?',answer:'Hayır. C3 daha büyük başlangıç boşluğudur; geçme, sıcaklık, devir ve üretici tavsiyesi uygun olduğunda seçilmelidir.'}
    ],
    relatedArticles:['rulman-kodu-okuma-rehberi','rulman-yaglama-araligi-belirleme']
  },
  hidrolik:{
    slug:'hidrolik',
    name:'Hidrolik Silindir Kuvvet ve Debi Hesaplayıcı',
    title:'Hidrolik Silindir Kuvvet Hesabı | Debi, Hız ve Güç',
    description:'Piston çapı, kol çapı, basınç, debi ve verimle hidrolik silindirin ileri-geri kuvvetini, hızını ve teorik gücünü hesaplayın.',
    intro:'Piston/kol çapı, basınç, debi ve mekanik verimden ileri-geri kuvveti, silindir hızını ve hidrolik gücü hesaplayın.',
    standard:'ISO 4413 güvenlik ilkeleri ve temel akışkan gücü bağıntıları',
    sections:[
      {heading:'Hidrolik silindir kuvveti nasıl hesaplanır?',paragraphs:[
        'Silindir kuvveti basınç ile etkin alanın çarpımına dayanır. İleri harekette pistonun tam alanı, geri harekette ise piston alanından kol alanı çıkarılarak bulunan halka alanı kullanılır. Bu nedenle aynı basınçta geri çekme kuvveti çoğu çift etkili silindirde ileri kuvvetten düşüktür.',
        'Araç mekanik verimi de hesaba katar. Gerçek sistemde conta sürtünmesi, karşı basınç, boru ve valf kayıpları, sıcaklık ve yük dinamiği nedeniyle ölçülen kuvvet teorik değerden farklı olabilir. Tasarımda uygun emniyet katsayısı ayrıca uygulanmalıdır.'
      ]},
      {heading:'Debiden silindir hızı bulma',paragraphs:[
        'Hız, hacimsel debinin etkin alana bölünmesiyle bulunur. Aynı debide kol tarafındaki alan daha küçük olduğu için geri dönüş hızı daha yüksek çıkar. Valf kapasitesi, hat çapı ve pompa debisi hedef hızın yalnızca teorik değil pratik olarak da sağlanıp sağlanamayacağını belirler.'
      ],bullets:['Çapları milimetre, basıncı bar ve debiyi litre/dakika girin.','Kol çapı piston çapından küçük olmalıdır.','Verimi yüzde 100’den büyük girmeyin.','Hortum, bağlantı ve silindir basınç sınıfını aşmayın.']},
      {heading:'Hidrolik güç ve motor seçimi',paragraphs:[
        'Teorik hidrolik güç bar ve litre/dakika değerlerinden hesaplanır. Elektrik motoru seçiminde pompa toplam verimi, çalışma çevrimi, kalkış koşulu ve eşzamanlı hareketler de dikkate alınır. Relief üzerinden uzun süre enerji kaybetmek yağ sıcaklığını yükseltir ve işletme maliyetini artırır.'
      ]},
      {heading:'Güvenli kullanım notu',paragraphs:[
        'Hidrolik sistemlerde depolanmış enerji, yüksek basınçlı yağ püskürmesi ve kontrolsüz yük hareketi ciddi risk oluşturur. Ölçüm veya bakım öncesi yük emniyete alınmalı, enerji izole edilmeli ve üreticinin basınç boşaltma prosedürü uygulanmalıdır.'
      ]}
    ],
    faq:[
      {question:'100 bar kaç kuvvet üretir?',answer:'Kuvvet piston alanına bağlıdır. Örneğin çap büyüdükçe aynı 100 bar basınçta kuvvet alanla orantılı olarak artar.'},
      {question:'Geri dönüş kuvveti neden daha düşüktür?',answer:'Kol tarafında basıncın etkidiği alandan piston kolunun kesit alanı çıkarılır; etkin alan küçüldüğü için kuvvet azalır.'},
      {question:'Hesaplanan güç motor gücü müdür?',answer:'Hayır. Bu teorik hidrolik güçtür. Motor seçiminde pompa ve tahrik verimleri ile çalışma koşulları ayrıca hesaba katılmalıdır.'}
    ],
    relatedArticles:['hidrolik-silindir-kuvvet-hesabi','hidrolik-sistem-ariza-teshisi','pompa-kavitasyonu-belirtileri']
  }
};

const seoArticles=[
  {
    slug:'iso-286-h7-g6-gecme-rehberi',title:'ISO 286 H7/g6 Geçme Rehberi: Tolerans, Boşluk ve Ölçüm',category:'Tolerans ve Ölçüm',
    description:'H7/g6, H7/h6 ve H7/p6 geçmelerinin farkını; limit ölçü, boşluk hesabı, yüzey kalitesi ve ölçüm planıyla birlikte öğrenin.',
    standard:'ISO 286-1, ISO 286-2',source:'ISO standart sistemi ve genel makine tasarım uygulamaları',revisionDate:REVISION_DATE,relatedTools:['iso-286-tolerans'],relatedSystems:['bearing'],relatedArticles:['kaplin-hizalama-uygulama-rehberi','rulman-kodu-okuma-rehberi'],
    sections:[
      {heading:'Delik esaslı sistemin mantığı',paragraphs:['H7/g6 gibi bir gösterimde büyük harf deliği, küçük harf mili tanımlar. H deliğinde alt sapma sıfırdır; delik nominal ölçüden küçük olmayacak şekilde tolerans alanı yukarı doğru açılır. g mili sıfır çizgisinin altında kaldığı için çoğu çap aralığında kontrollü boşluk oluşturur. Bu yaklaşım standart matkap, rayba ve mastar kullanımını kolaylaştırdığı için üretimde yaygındır.']},
      {heading:'Geçme seçimini etkileyen koşullar',paragraphs:['Yalnızca katalogdaki geçme adına bakmak yeterli değildir. Çalışma sıcaklığı, farklı malzemelerin genleşmesi, kaplama kalınlığı, yüzey pürüzlülüğü, yük yönü, yağlama ve sökülebilirlik ihtiyacı gerçek çalışma boşluğunu değiştirir. İnce cidarlı göbekler presleme sırasında genişleyebilir; ağır gövdeler ise daha yüksek montaj kuvveti isteyebilir.'],bullets:['H7/g6: hassas konumlama ve kontrollü kayma için sık kullanılan başlangıç seçeneği.','H7/h6: sıfıra yakın küçük boşluk gerektiren uygulamalar.','H7/p6: pres veya sıkı geçme adaylarından biri; mukavemet ve montaj hesabı gerekir.']},
      {heading:'Ölçüm planı',paragraphs:['Delik komparatörü, iç çap mikrometresi veya uygun mastarın belirsizliği tolerans genişliğine göre seçilmelidir. Parça ve ölçüm cihazı mümkün olduğunca referans sıcaklığa dengelenmeli, çap en az iki eksende ve birden fazla derinlikte ölçülmelidir. Ovalite ve koniklik tek bir çap değerinde görünmeyebilir.']},
      {heading:'Üretim ve bakım bağlantısı',paragraphs:['Geçme kaynaklı rulman dönmesi, fretting veya sökme zorluğu yaşanıyorsa yalnızca rulman değiştirmek yerine mil ve yatak gerçek ölçüleri kaydedilmelidir. Dijital bakım kaydında ölçüm, fotoğraf ve kullanılan parça birlikte tutulduğunda tekrarlayan geçme sorunları görünür hâle gelir.']}
    ]
  },
  {
    slug:'kilavuz-on-delik-secimi-metrik-unc-unf',title:'Kılavuz Ön Delik Seçimi: Metrik, UNC ve UNF İçin Uygulama Rehberi',category:'Talaşlı İmalat',
    description:'Kesme ve form kılavuzlarında ön delik çapını; M6, M8, UNC ve UNF örnekleri, malzeme ve kör delik koşullarıyla doğru seçin.',
    standard:'ISO 724, ISO 965, ASME B1.1',source:'Diş standardı temel ölçüleri ve takım üreticisi uygulama verileri',revisionDate:REVISION_DATE,relatedTools:['kilavuz-on-delik'],relatedSystems:['cnc'],relatedArticles:['cnc-devir-ilerleme-hesabi'],
    sections:[
      {heading:'Diş doluluğu ve tork dengesi',paragraphs:['Ön delik küçüldükçe teorik diş doluluğu artar ancak kesme torku hızla yükselir. Uygulamada çok yüksek diş yüzdesi her zaman daha güçlü bağlantı anlamına gelmez; takım kırılması ve kötü yüzey riski artabilir. Malzeme dayanımı, delik derinliği ve bağlantının yükü birlikte değerlendirilmelidir.']},
      {heading:'Kesme ve form kılavuzu',paragraphs:['Kesme kılavuzu talaş oluşturur; form kılavuzu ise sünek malzemeyi şekillendirir. Form kılavuzunun ön deliği çoğu zaman daha büyüktür ve delik toleransı daha kritiktir. Dökme demir gibi gevrek malzemeler form kılavuzuna uygun olmayabilir.'],bullets:['Kör delikte kılavuz giriş boyu ve talaş hacmi için ek derinlik bırakın.','Spiral oluk yönünü delik tipine göre seçin.','Matkap sonrası çapı, salgıyı ve pahı kontrol edin.','Yağlayıcıyı malzeme ve takım kaplamasına göre belirleyin.']},
      {heading:'Metrik ve inç dişlerin okunması',paragraphs:['M8×1,25 gösteriminde 8 mm anma çapı ve 1,25 mm adım vardır. 1/4-20 UNC gösteriminde çap inç cinsinden, 20 değeri ise inç başına diş sayısıdır. UNF serisi aynı çapta daha ince adıma sahiptir. Hesapta birimleri karıştırmamak için tüm değerler ortak birime dönüştürülmelidir.']},
      {heading:'Proses doğrulaması',paragraphs:['İlk parçadan sonra uygun diş mastarı, vida denemesi ve gerektiğinde kesit incelemesi yapılmalıdır. Kılavuz ömrü, tork artışı ve kırılma kayıtları takım değişim periyodunun belirlenmesinde kullanılır.']}
    ]
  },
  {
    slug:'cnc-devir-ilerleme-hesabi',title:'CNC Devir ve İlerleme Hesabı: Torna ve Freze İçin Güvenli Başlangıç',category:'CNC ve Talaşlı İmalat',
    description:'Kesme hızı, çap, diş sayısı ve diş başı ilerlemeden CNC devri ile tezgâh ilerlemesini hesaplayıp sahada doğrulayın.',
    standard:'ISO 3002 terminolojisi',source:'Genel talaşlı imalat bağıntıları ve takım üreticisi katalog yaklaşımı',revisionDate:REVISION_DATE,relatedTools:['cnc-kesme'],relatedSystems:['cnc'],relatedArticles:['cnc-koruyucu-bakim-kontrol-listesi','kilavuz-on-delik-secimi-metrik-unc-unf'],
    sections:[
      {heading:'Formüllerin doğru kullanımı',paragraphs:['Devir hesabında kesme hızı metre/dakika, çap milimetre alınır. Freze ilerlemesi devir, etkin diş sayısı ve diş başı ilerlemenin çarpımıdır. Tornada ise milimetre/devir değeri devirle çarpılır. Birimlerin tutarlı olması, bin katlık hataları önler.']},
      {heading:'Katalog değerini neden doğrudan kullanmamalı?',paragraphs:['Katalog aralıkları belirli takım çıkıntısı, bağlama, soğutma ve tezgâh koşullarına dayanır. Zayıf fikstür, uzun takım, ince cidar veya aşınmış iş mili daha düşük başlangıç yükü gerektirebilir. Buna karşılık ilerlemeyi aşırı azaltmak sürtünmeye ve ısıya yol açabilir.'],bullets:['İş mili yük yüzdesini izleyin.','Talaş şekli ve rengini kaydedin.','Yüzey kalitesi ile ölçü sapmasını birlikte değerlendirin.','Takım ömrünü parça sayısı veya kesme süresiyle takip edin.']},
      {heading:'Titreşim olduğunda',paragraphs:['Sadece devri düşürmek geçici çözüm olabilir. Takım çıkıntısı, tutucu temizliği, balans, parça desteği, kesici geometrisi ve tezgâh boşlukları kontrol edilmelidir. Stabilite bölgesine ulaşmak için bazı durumlarda devri kontrollü biçimde artırmak da işe yarayabilir; değişiklikler tek tek denenmelidir.']},
      {heading:'İşletmeye özel kesme veri tabanı',paragraphs:['Hesaplanan başlangıç değeri, kullanılan takım kodu, malzeme partisi ve gerçek sonuçlarla birlikte kaydedilirse benzer işlerde deneme süresi azalır. Standartlaştırılmış kayıt, operatörler arasındaki bilgi kaybını önler.']}
    ]
  },
  {
    slug:'hidrolik-silindir-kuvvet-hesabi',title:'Hidrolik Silindir Kuvvet Hesabı: Alan, Basınç, Debi ve Güç',category:'Hidrolik',
    description:'Hidrolik silindirin ileri ve geri kuvvetini, hızını ve güç ihtiyacını hesaplayın; kayıp ve emniyet katsayısını doğru uygulayın.',
    standard:'ISO 4413',source:'Temel akışkan gücü bağıntıları ve ISO 4413 güvenlik ilkeleri',revisionDate:REVISION_DATE,relatedTools:['hidrolik'],relatedSystems:['hydraulic'],relatedArticles:['hidrolik-sistem-ariza-teshisi','pompa-kavitasyonu-belirtileri'],
    sections:[
      {heading:'Basınç ve alan ilişkisi',paragraphs:['Kuvvet, basıncın etkin piston alanıyla çarpılmasıdır. Piston çapındaki küçük bir artış alanı karesel olarak büyüttüğü için kuvveti belirgin artırır. Geri yönde kol alanı çıkarıldığından kuvvet azalır ve aynı debide hız yükselir.']},
      {heading:'Gerçek kuvvet neden düşük çıkar?',paragraphs:['Conta sürtünmesi, karşı basınç, valf ve hat kayıpları, pompa verimi ve mekanik hizasızlık teorik kuvveti azaltır. Soğuk ve yüksek viskoziteli yağ başlangıç kayıplarını artırabilir. Tasarım yükü teorik kuvvetin sınırında bırakılmamalıdır.'],bullets:['Yükü mekanik olarak emniyete almadan hat açmayın.','Silindir ve hortum basınç sınıfını doğrulayın.','Relief ayarını yük altında ölçün.','Ani yük ve darbe etkisini ayrıca değerlendirin.']},
      {heading:'Debi ve çevrim süresi',paragraphs:['Hedef strok süresi biliniyorsa gerekli hız ve buradan debi hesaplanabilir. Pompa debisinin yanı sıra yön valfi kapasitesi ve boru çapı da kontrol edilmelidir. Aşırı küçük hatlar basınç kaybı ve sıcaklık artışı oluşturur.']},
      {heading:'Enerji verimliliği',paragraphs:['Relief üzerinden sürekli geçen fazla debi doğrudan ısıya dönüşür. Değişken deplasmanlı pompa, uygun valf mimarisi veya hız kontrollü tahrik gibi çözümler çevrime göre değerlendirilmelidir. Enerji ölçümü bakım verileriyle birleştirildiğinde iç kaçak artışı erken fark edilebilir.']}
    ]
  },
  {
    slug:'rulman-kodu-okuma-rehberi',title:'Rulman Kodu Okuma Rehberi: Seri, İç Çap, 2RS, ZZ ve C3',category:'Rulman ve Mekanik',
    description:'6205, 6308, 2RS, ZZ, C3, P5 ve K gibi rulman kodlarını okuyun; doğru eşdeğer ve çalışma boşluğu seçimini öğrenin.',
    standard:'ISO 15, ISO 492, ISO 5753-1',source:'ISO boyut ve tolerans sistemi ile üretici katalogları',revisionDate:REVISION_DATE,relatedTools:['rulman-kod'],relatedSystems:['bearing'],relatedArticles:['rulman-yaglama-araligi-belirleme','titresim-analizi-baslangic-rehberi'],
    sections:[
      {heading:'Temel kod ve delik çapı',paragraphs:['Rulman temel kodu tip ve boyut serisini tanımlar. Birçok metrik rulmanda son iki hane 04 ve üzerindeyse beşle çarpılarak mil çapı bulunur. 00–03 kodlarının özel çapları vardır. Özel seri ve iğneli rulmanlarda bu basit kural geçerli olmayabilir.']},
      {heading:'Sızdırmazlık ve boşluk',paragraphs:['2RS tipi conta kirli ortamda koruma sağlar, ZZ metal kapak ise daha düşük sürtünmeli olabilir. C3 ve C4 sonekleri daha büyük başlangıç iç boşluğunu gösterir. Sıkı geçme ve sıcaklık artışı çalışma boşluğunu azalttığı için başlangıç boşluğu seçiminde bu etkiler hesaplanır.'],bullets:['Üretici eşdeğer tablosunu kontrol edin.','Açık rulmanda yağlama düzenini ayrıca tasarlayın.','Conta malzemesinin sıcaklık ve kimyasal uyumunu doğrulayın.','Hassasiyet sınıfını mil ve yatak toleransıyla birlikte seçin.']},
      {heading:'Arızalı rulmanın incelenmesi',paragraphs:['Sökülen rulman temizlenmeden önce yağlayıcı dağılımı, renk, hasar konumu ve montaj yönü fotoğraflanmalıdır. Yüzey hasarının yük bölgesiyle ilişkisi hizasızlık, yanlış geçme veya aşırı yük konusunda ipucu verir.']},
      {heading:'Stok kartı bilgileri',paragraphs:['Stokta yalnızca 6205 gibi kısa kod değil, tam sonek, üretici, kafes ve boşluk bilgisi tutulmalıdır. Benzer görünen fakat farklı sızdırmazlık veya boşluk özelliğine sahip rulmanların yanlış takılması böylece önlenir.']}
    ]
  },
  {
    slug:'elektrik-motoru-periyodik-bakim',title:'Elektrik Motoru Periyodik Bakım Kontrol Listesi',category:'Elektrik Motorları',
    description:'Elektrik motorlarında güvenli periyodik bakım için akım, sıcaklık, titreşim, izolasyon, bağlantı, soğutma ve rulman kontrolleri.',
    standard:'IEC 60034 serisi ve üretici bakım talimatları',source:'IEC motor terminolojisi, LOTO ilkeleri ve kestirimci bakım uygulamaları',revisionDate:REVISION_DATE,relatedTools:[],relatedSystems:['motor','electrical','bearing'],relatedArticles:['titresim-analizi-baslangic-rehberi','rulman-yaglama-araligi-belirleme'],
    sections:[
      {heading:'Bakım öncesi güvenlik',paragraphs:['Motor durdurulmalı, tüm enerji kaynakları kilitlenip etiketlenmeli ve gerilimsizlik uygun cihazla doğrulanmalıdır. Kapasitör, sürücü DC barası, dönen yük ve geri beslenen mekanik enerji ayrıca değerlendirilir. Ölçüm gereği enerjili çalışma yapılacaksa yetkili prosedür ve uygun kişisel koruyucu donanım gerekir.']},
      {heading:'Çalışırken alınacak trendler',paragraphs:['Faz akımları ve gerilimleri, gövde ile rulman sıcaklıkları, yatay-dikey-eksenel titreşim ve olağan dışı ses aynı yük koşulunda kaydedilmelidir. Tek ölçümden çok değişim eğilimi değerlidir. Yük veya ortam sıcaklığı kaydedilmezse trend yanlış yorumlanabilir.'],bullets:['Faz akım dengesini karşılaştırın.','Fan, hava kanalı ve kanat temizliğini kontrol edin.','Kaplin ve temel bağlantılarını gözden geçirin.','Kablo rakoru, klemens ve topraklamayı kontrol edin.']},
      {heading:'İzolasyon ve elektrik bağlantıları',paragraphs:['İzolasyon testi motor ve sürücü üreticisinin prosedürüne göre yapılmalı; elektronik ekipman ölçümden ayrılmalıdır. Sonuç sıcaklıkla birlikte kaydedilmeli ve geçmiş trendle karşılaştırılmalıdır. Klemens sıkılığı uygun tork yöntemiyle kontrol edilir.']},
      {heading:'Bakım periyodu',paragraphs:['Periyot; çalışma saati, yük, ortam, kritikiyet ve üretici talimatına göre belirlenir. Tozlu, sıcak, titreşimli veya sürekli çalışan motorlarda daha sık kontrol gerekir. Bulgular iş emrine bağlanmalı ve uygunsuzluk için sorumlu ile termin atanmalıdır.']}
    ]
  },
  {
    slug:'hidrolik-sistem-ariza-teshisi',title:'Hidrolik Sistem Arıza Teşhisi: Basınç Var, Hareket Yoksa Ne Yapılır?',category:'Hidrolik',
    description:'Hidrolik sistemlerde düşük basınç, yavaş hareket, ısınma ve kaçak sorunlarını ölçüm sırasıyla teşhis edin.',
    standard:'ISO 4413',source:'Hidrolik devre ölçüm yaklaşımı ve güvenli bakım uygulamaları',revisionDate:REVISION_DATE,relatedTools:['hidrolik'],relatedSystems:['hydraulic'],relatedArticles:['pompa-kavitasyonu-belirtileri','hidrolik-silindir-kuvvet-hesabi'],
    sections:[
      {heading:'Önce belirtiyi ölçülebilir hâle getirin',paragraphs:['Yavaş, güçsüz veya sıcak gibi ifadeler yük, basınç, debi, yağ sıcaklığı ve çevrim süresiyle sayısallaştırılmalıdır. Arızanın her zaman mı yoksa yağ ısındıktan sonra mı oluştuğu kaydedilir. Devrede rastgele ayar değiştirmek asıl nedeni gizleyebilir.']},
      {heading:'Basınç ve debiyi birlikte değerlendirin',paragraphs:['Basınç direncin sonucudur; tek başına pompanın sağlıklı olduğunu göstermez. Pompa çıkışında basınç normal fakat aktüatör yavaşsa debi kaybı, valf kısıtı veya iç kaçak araştırılır. Basınç oluşmuyorsa emiş, relief, pompa tahriki ve büyük kaçaklar sırayla kontrol edilir.'],bullets:['Yağ seviyesi, viskozite ve köpürmeyi kontrol edin.','Filtre fark basıncı ve emiş hattı vakumunu değerlendirin.','Relief dönüşünde sürekli akış olup olmadığını kontrol edin.','Silindir iç kaçak testini güvenli yük koşulunda yapın.']},
      {heading:'Isınmanın kaynağı',paragraphs:['Basınç düşümüyle geçen debi ısı üretir. Kısık debi valfi, sürekli açık relief, iç kaçak ve yanlış viskozite başlıca adaylardır. Soğutucuyu büyütmeden önce oluşan kaybın kaynağı bulunmalıdır.']},
      {heading:'Kayıt ve tekrar önleme',paragraphs:['Ölçüm noktaları, cihaz seri numarası, sıcaklık, yük ve ayar değerleri arıza kaydına eklenmelidir. Değiştirilen parçanın ardından aynı ölçümler tekrarlanarak onarım doğrulanır; yalnızca makinenin hareket etmesi yeterli kabul edilmez.']}
    ]
  },
  {
    slug:'pnomatik-kacak-tespiti',title:'Pnömatik Kaçak Tespiti ve Basınç Kaybını Azaltma Rehberi',category:'Pnömatik',
    description:'Basınçlı hava kaçaklarını güvenli biçimde bulun, etiketleyin, önceliklendirin ve enerji kaybını ölçülebilir şekilde azaltın.',
    standard:'ISO 4414 ve işletme enerji yönetimi uygulamaları',source:'Pnömatik güvenlik ve kaçak yönetimi prensipleri',revisionDate:REVISION_DATE,relatedTools:[],relatedSystems:['pneumatic'],relatedArticles:['bakim-kpi-mtbf-mttr-rehberi'],
    sections:[
      {heading:'Kaçak taraması ne zaman yapılır?',paragraphs:['Üretim durduğunda ve ortam gürültüsü azaldığında kaçaklar daha kolay bulunur. Ultrasonik cihaz küçük kaçakları hızlı tarar; sabunlu su doğrulama için kullanılabilir. El ile bağlantı sıkmak yerine enerji izolasyonu ve uygun tork prosedürü uygulanmalıdır.']},
      {heading:'Kaçağı etiketleme',paragraphs:['Her nokta fotoğraf, makine, komponent, tahmini büyüklük ve tarih ile kaydedilir. Güvenlik veya üretim etkisi yüksek kaçaklar önceliklendirilir. Valf egzozundaki sürekli hava, silindir keçesi ya da sürgü iç kaçağına işaret edebilir.'],bullets:['Rakor ve hortum bağlantılarını tarayın.','FRL drenajı ve regülatörü kontrol edin.','Valf egzozlarını makine beklemedeyken dinleyin.','Onarım sonrası aynı yöntemle tekrar ölçün.']},
      {heading:'Basıncı yükseltmek çözüm değildir',paragraphs:['Uzak noktada basınç düşüyorsa ana regülatörü yükseltmek kaçak debisini ve enerji tüketimini artırabilir. Hat çapı, filtre tıkanması, eşzamanlı tüketim ve kompresör kontrolü birlikte incelenmelidir.']},
      {heading:'Sürekli iyileştirme',paragraphs:['Kaçak sayısı, onarım süresi ve üretim dışı taban debisi aylık izlenebilir. Aynı bağlantı tipinde tekrarlayan sorun varsa malzeme standardı veya montaj yöntemi değiştirilmelidir.']}
    ]
  },
  {
    slug:'cnc-koruyucu-bakim-kontrol-listesi',title:'CNC Torna ve Freze Koruyucu Bakım Kontrol Listesi',category:'CNC Bakım',
    description:'CNC tezgâhlarda günlük, haftalık, aylık ve çalışma saati bazlı yağlama, geometri, filtre, spindle ve emniyet kontrolleri.',
    standard:'ISO 16090-1 güvenlik ilkeleri ve tezgâh üreticisi talimatları',source:'CNC üretici bakım planları ve koruyucu bakım uygulamaları',revisionDate:REVISION_DATE,relatedTools:['cnc-kesme'],relatedSystems:['cnc','electrical'],relatedArticles:['cnc-devir-ilerleme-hesabi','bakim-kpi-mtbf-mttr-rehberi'],
    sections:[
      {heading:'Günlük operatör kontrolleri',paragraphs:['Yağlama seviyesi, hava basıncı, soğutma sıvısı, talaş tahliyesi ve emniyet kapıları vardiya başında kontrol edilir. Alarmlar ve olağan dışı sesler bakım sistemine kaydedilir. Operatör temizliği, hassas kızak ve ölçüm yüzeylerine zarar vermeyecek yöntemle yapılmalıdır.']},
      {heading:'Haftalık ve aylık bakım',paragraphs:['Filtreler, fanlar, konveyör, takım magazini, hidrolik ünite ve elektrik panosu çevresi gözden geçirilir. Spindle konik yüzeyi temizlenir ve uygun mastarla hasar kontrol edilir. Program ve parametre yedekleri kontrollü biçimde doğrulanır.'],bullets:['Merkezi yağlama tüketimini trendleyin.','Soğutma sıvısı konsantrasyonu ve pH değerini izleyin.','Ayna veya fikstür sıkma basıncını kontrol edin.','Eksen koruyucu körük ve sıyırıcıları inceleyin.']},
      {heading:'Saat bazlı görevler',paragraphs:['Spindle, vida ve eksen bileşenlerinin bakım aralığı üretici çalışma saati sınırlarına bağlanmalıdır. Takvim periyodu tek başına düşük veya yüksek kullanımlı tezgâhları doğru yönetmez. Saat eşiği dolduğunda iş emri otomatik oluşturulabilir.']},
      {heading:'Geometri ve doğrulama',paragraphs:['Çarpma, rulman değişimi veya kalite sapması sonrası geometrik kontrol planlanır. Ballbar, lazer veya mastar sonuçları tarih ve sıcaklıkla kaydedilir. Ayar değişikliğinden sonra referans parça veya ölçüm programıyla sonuç doğrulanır.']}
    ]
  },
  {
    slug:'rulman-yaglama-araligi-belirleme',title:'Rulman Yağlama Aralığı Nasıl Belirlenir?',category:'Rulman ve Yağlama',
    description:'Rulman gresleme periyodunu devir, çap, sıcaklık, yük, kirlenme ve yatak konumuna göre belirleyip aşırı yağlamayı önleyin.',
    standard:'ISO 281 ve üretici yağlama hesap yöntemleri',source:'Rulman üreticisi yağlama kılavuzları ve saha bakım yaklaşımı',revisionDate:REVISION_DATE,relatedTools:['rulman-kod'],relatedSystems:['bearing'],relatedArticles:['rulman-kodu-okuma-rehberi','titresim-analizi-baslangic-rehberi'],
    sections:[
      {heading:'Sabit periyot neden yeterli değildir?',paragraphs:['Gres ömrü rulman tipi, çap, devir, sıcaklık, yük, titreşim, yatak konumu ve kirlenmeyle değişir. Aynı fabrikadaki iki 6205 rulman farklı hız ve sıcaklıkta çalışıyorsa aynı periyot doğru olmayabilir. Üretici hesap yöntemi başlangıç değeri sağlar; saha trendiyle iyileştirilir.']},
      {heading:'Gres miktarı ve uygulama',paragraphs:['Aşırı gres sürtünme ve sıcaklığı artırabilir, keçeye zarar verebilir. Yetersiz gres ise film kaybına yol açar. Gres tabancası vuruş başına gerçek miktar bakım ekibi tarafından ölçülmeli ve iş emrinde gram cinsinden belirtilmelidir.'],bullets:['Farklı gresleri uyumluluk doğrulanmadan karıştırmayın.','Gresörlüğü uygulama öncesi temizleyin.','Tahliye yolu varsa açık olduğundan emin olun.','Yağlama öncesi ve sonrası sıcaklık/titreşim izleyin.']},
      {heading:'Koşula dayalı yağlama',paragraphs:['Ultrason, sıcaklık ve titreşim trendi yeniden yağlama kararını destekleyebilir. Her yağlamadan sonra değer düşüyor ve sonra düzenli yükseliyorsa işletmeye özel periyot bulunabilir. Değer yükseliyorsa aşırı miktar veya farklı bir mekanik sorun araştırılmalıdır.']},
      {heading:'Kayıt standardı',paragraphs:['Rulman noktası, gres kodu, miktar, tarih, çalışma saati ve uygulayan kişi kaydedilmelidir. Renkle gres sınıfı yönetmek tek başına yeterli değildir; ürün kodu ve teknik özellik açıkça tanımlanmalıdır.']}
    ]
  },
  {
    slug:'pompa-kavitasyonu-belirtileri',title:'Hidrolik Pompa Kavitasyonu: Belirtiler, Nedenler ve Kontroller',category:'Hidrolik',
    description:'Hidrolik pompada kavitasyon ve hava emişini ses, köpürme, basınç dalgalanması ve emiş hattı kontrolleriyle ayırt edin.',
    standard:'ISO 4413 güvenlik ilkeleri',source:'Pompa üreticisi emiş şartları ve hidrolik bakım uygulamaları',revisionDate:REVISION_DATE,relatedTools:['hidrolik'],relatedSystems:['hydraulic'],relatedArticles:['hidrolik-sistem-ariza-teshisi','hidrolik-silindir-kuvvet-hesabi'],
    sections:[
      {heading:'Kavitasyon ve havalanma farkı',paragraphs:['Kavitasyonda pompa girişindeki basınç yetersiz kaldığı için yağ içindeki buhar boşlukları oluşur ve yüksek basınç bölgesinde çöker. Havalanmada ise emiş hattından sisteme dış hava girer. İkisi de gürültü ve köpürme yapabilir fakat kök nedenleri farklıdır.']},
      {heading:'Kontrol sırası',paragraphs:['Yağ seviyesi, sıcaklık ve doğru viskozite kontrol edilir. Emiş filtresi, hortum çökmesi, kapalı vana, küçük hat çapı ve bağlantı sızdırmazlığı incelenir. Pompa dönüş yönü ve devir değeri üretici sınırıyla karşılaştırılır.'],bullets:['Soğuk ilk çalıştırma davranışını kaydedin.','Emiş hattındaki keskin dirsek ve daralmaları inceleyin.','Tank havalandırmasını ve dönüş hattı yerleşimini kontrol edin.','Filtreyi yalnızca görsel değil fark basıncıyla değerlendirin.']},
      {heading:'Hasar belirtileri',paragraphs:['Sürekli kavitasyon pompa yüzeylerinde erozyon, debi kaybı ve erken arıza oluşturabilir. Basınç dalgalanması, metalik ses, yüksek gövde sıcaklığı ve düzensiz aktüatör hareketi birlikte görülebilir.']},
      {heading:'Onarım doğrulaması',paragraphs:['Neden giderildikten sonra aynı sıcaklık ve yükte ses, emiş koşulu, debi ve basınç yeniden ölçülür. Sadece sesin azalması yeterli değildir; performans ve yağ durumu da doğrulanmalıdır.']}
    ]
  },
  {
    slug:'kaplin-hizalama-uygulama-rehberi',title:'Kaplin Hizalama Rehberi: Paralel ve Açısal Kaçıklık',category:'Mekanik Bakım',
    description:'Motor-pompa kaplinlerinde yumuşak ayak, paralel ve açısal kaçıklık, termal büyüme ve ölçüm doğrulamasını doğru sırayla uygulayın.',
    standard:'Üretici hizalama toleransları ve genel makine montaj uygulamaları',source:'Lazer hizalama ve komparatörle hizalama saha uygulamaları',revisionDate:REVISION_DATE,relatedTools:['iso-286-tolerans'],relatedSystems:['motor','bearing','gearbox'],relatedArticles:['titresim-analizi-baslangic-rehberi','elektrik-motoru-periyodik-bakim'],
    sections:[
      {heading:'Hizalamadan önce',paragraphs:['Makine enerjisi izole edilir, kaplin muhafazası güvenle sökülür ve temel ile bağlantıların durumu kontrol edilir. Boru gerilimi, kaplin hasarı, mil salgısı ve yatak boşluğu giderilmeden yapılan hassas hizalama kalıcı olmaz.']},
      {heading:'Yumuşak ayak kontrolü',paragraphs:['Makine ayağının tabana tam oturmaması sıkma sırasında gövdeyi büker ve hizayı değiştirir. Ayaklar uygun sırada gevşetilerek hareket ölçülür; kir, boya, çapak veya yanlış şim nedeni giderilir. Birçok ince şim yerine temiz ve sağlam paket tercih edilir.'],bullets:['Ölçüm yüzeylerini temizleyin.','Cıvata torkunu üretici değerine göre uygulayın.','Dikey ve yatay düzeltmeyi ayrı izleyin.','Her sıkma adımından sonra ölçümü tekrarlayın.']},
      {heading:'Paralel ve açısal kaçıklık',paragraphs:['Paralel kaçıklık mil eksenlerinin ötelenmesi, açısal kaçıklık ise eksenlerin farklı açıyla kesişmesidir. Lazer cihazı veya komparatör yöntemi her iki bileşeni birlikte değerlendirir. Hedef tolerans devir, kaplin tipi ve üretici tavsiyesine göre belirlenir.']},
      {heading:'Termal büyüme ve son kontrol',paragraphs:['Çalışma sıcaklığında makineler farklı miktarda büyüyebilir. Üretici termal hedef veriyorsa soğuk hizalama buna göre ofsetlenir. Makine çalıştırıldıktan sonra titreşim ve sıcaklık trendiyle sonuç doğrulanır.']}
    ]
  },
  {
    slug:'titresim-analizi-baslangic-rehberi',title:'Titreşim Analizine Başlangıç: Ölçüm Noktası, Trend ve Spektrum',category:'Kestirimci Bakım',
    description:'Dönen makinelerde titreşim ölçüm noktalarını, yatay-dikey-eksenel yönleri, trend takibini ve temel spektrum yorumunu öğrenin.',
    standard:'ISO 20816 serisi',source:'Makine titreşimi ölçüm ve kestirimci bakım uygulamaları',revisionDate:REVISION_DATE,relatedTools:[],relatedSystems:['bearing','motor','gearbox'],relatedArticles:['rulman-yaglama-araligi-belirleme','kaplin-hizalama-uygulama-rehberi'],
    sections:[
      {heading:'Tekrarlanabilir ölçüm',paragraphs:['Sensör aynı rulman noktasında, aynı yönde ve benzer yük/devir koşulunda kullanılmalıdır. Manyetik taban yüzeyi temiz ve sağlam olmalı; elde prob kullanılıyorsa basınç ve açı değişimi sonuçları etkileyebilir. Ölçüm noktaları makine üzerinde kodlanmalıdır.']},
      {heading:'Genel seviye ve spektrum',paragraphs:['Toplam titreşim seviyesi makinenin genel durum trendini gösterir, spektrum ise frekans bileşenlerini ayırmaya yardımcı olur. Devir frekansı, harmonikler, dişli kavrama ve rulman karakteristik frekansları arıza hipotezi oluşturur; tek bir tepe kesin teşhis değildir.'],bullets:['Devir ve yükü her ölçümde kaydedin.','Yatay, dikey ve eksenel yönleri karşılaştırın.','Yeni bakım sonrası referans ölçüm alın.','Ani artışı proses değişikliğiyle birlikte değerlendirin.']},
      {heading:'Alarm sınırları',paragraphs:['Genel standart sınıfları başlangıç sağlar fakat makineye özel normal seviye ve değişim hızı daha değerlidir. Yeni veya revizyonlu makinede temel değer oluşturulur. Uyarı ve alarm eşikleri kritikiyet ile arızaya kadar gereken müdahale süresine göre tanımlanır.']},
      {heading:'Teşhisi doğrulama',paragraphs:['Titreşim bulgusu sıcaklık, yağ analizi, ultrason, görsel kontrol ve proses verisiyle doğrulanmalıdır. Parça değişimi sonrası aynı koşulda tekrar ölçüm yapılmadan iş kapatılmamalıdır.']}
    ]
  },
  {
    slug:'bakim-kpi-mtbf-mttr-rehberi',title:'Bakım KPI Rehberi: MTBF, MTTR, Kullanılabilirlik ve Planlı Bakım Oranı',category:'Bakım Yönetimi',
    description:'MTBF, MTTR, kullanılabilirlik, planlı bakım oranı ve iş emri uyumunu doğru veri tanımlarıyla hesaplayıp yorumlayın.',
    standard:'EN 15341 ve ISO 55001 yönetim yaklaşımı',source:'Bakım performans göstergeleri ve varlık yönetimi uygulamaları',revisionDate:REVISION_DATE,relatedTools:[],relatedSystems:[],relatedArticles:['yedek-parca-minimum-maksimum-stok','cnc-koruyucu-bakim-kontrol-listesi'],
    sections:[
      {heading:'MTBF neyi anlatır?',paragraphs:['MTBF, onarılabilir bir varlığın arızalar arasındaki ortalama çalışma süresidir. Paydadaki arıza tanımı tutarlı değilse sonuç anlamını kaybeder. Operatör duruşu, planlı bakım ve kalite beklemesinin arıza süresine dahil edilip edilmeyeceği veri sözlüğünde açıkça tanımlanmalıdır.']},
      {heading:'MTTR ve kullanılabilirlik',paragraphs:['MTTR onarımın ortalama süresini ölçer; parça bekleme veya üretim izni gibi sürelerin ayrı izlenmesi kök nedeni görünür kılar. Teknik kullanılabilirlik kabaca MTBF ile MTTR ilişkisinden hesaplanabilir fakat üretim programı ve performans kaybını tek başına açıklamaz.'],bullets:['Başlangıç ve bitiş zamanlarını otomatik iş emri kayıtlarından alın.','Arıza sınıflarını standartlaştırın.','Kritik makineleri ayrı değerlendirin.','Aylık ortalamayla birlikte dağılım ve en kötü vakaları inceleyin.']},
      {heading:'Davranışı yönlendiren KPI seçimi',paragraphs:['Sadece kapanan iş emri sayısını hedeflemek, kayıtların erken kapatılmasına yol açabilir. Gecikmiş planlı bakım, tekrar arıza, planlı/plansız çalışma oranı ve bulgu kapatma süresi dengeli bir pano oluşturur.']},
      {heading:'KPI’dan aksiyona',paragraphs:['Her gösterge için sahip, veri kaynağı, hedef, inceleme periyodu ve beklenen aksiyon tanımlanmalıdır. Değer değiştiğinde karar üretmeyen gösterge rapor yüküne dönüşür.']}
    ]
  },
  {
    slug:'yedek-parca-minimum-maksimum-stok',title:'Yedek Parçada Minimum–Maksimum Stok ve Yeniden Sipariş Noktası',category:'Stok ve Yedek Parça',
    description:'Kritik yedek parçalar için tüketim, tedarik süresi, emniyet stoğu ve duruş maliyetine göre minimum-maksimum stok belirleyin.',
    standard:'ISO 55001 varlık yönetimi yaklaşımı',source:'Bakım yedek parça planlama ve stok kontrol uygulamaları',revisionDate:REVISION_DATE,relatedTools:[],relatedSystems:[],relatedArticles:['bakim-kpi-mtbf-mttr-rehberi','rulman-kodu-okuma-rehberi'],
    sections:[
      {heading:'Her parçaya aynı yöntem uygulanmaz',paragraphs:['Ucuz fakat makineyi uzun süre durduran kritik bir conta ile pahalı ancak kolay bulunan standart motor aynı stok politikasına sahip olmamalıdır. Kritikiyet; arıza olasılığı, teslim süresi, alternatif bulunabilirliği, duruş etkisi ve raf ömrüyle değerlendirilir.']},
      {heading:'Yeniden sipariş noktası',paragraphs:['Temel yaklaşım, tedarik süresindeki beklenen tüketim ile emniyet stoğunun toplamıdır. Tüketimi düzensiz kritik parçalar için yalnızca aylık ortalama yanıltıcı olabilir; arıza senaryosu ve tedarik riski ayrıca değerlendirilir.'],bullets:['Gerçek giriş-çıkış hareketlerini kaydedin.','Tedarik süresini siparişten teslimata ölçün.','Muadil ve onarılabilir parça bilgisini tutun.','Raf ömrü ve saklama koşullarını izleyin.']},
      {heading:'Sayım ve kayıt doğruluğu',paragraphs:['Sistem miktarı ile fiziksel miktar farklıysa doğrudan kartı değiştirmek yerine sayım düzeltme hareketi oluşturulmalıdır. Böylece farkın tarihi, nedeni ve sorumlusu izlenebilir. Kritik parçalar daha sık çevrim sayımına alınabilir.']},
      {heading:'Ölü stok ve standardizasyon',paragraphs:['Uzun süre hareket görmeyen parçalar ihtiyaç dışı olmayabilir; kritik sigorta niteliği taşıyabilir. Karar verilmeden önce bağlı makineler ve muadil kullanımlar incelenir. Aynı işlevdeki farklı marka ve kodların standardizasyonu stok maliyetini düşürebilir.']}
    ]
  },
  {
    slug:'mekanik-salmastra-ariza-nedenleri',title:'Mekanik Salmastra Arızaları: Kaçak, Kuru Çalışma ve Hizalama',category:'Pompa Bakımı',
    description:'Pompa mekanik salmastralarında kaçak nedenlerini; kuru çalışma, yüzey hasarı, boru gerilimi, titreşim ve flush koşullarıyla inceleyin.',
    standard:'Pompa ve salmastra üreticisi talimatları',source:'Döner ekipman bakım ve kök neden analizi uygulamaları',revisionDate:REVISION_DATE,relatedTools:['hidrolik'],relatedSystems:['bearing'],relatedArticles:['kaplin-hizalama-uygulama-rehberi','titresim-analizi-baslangic-rehberi'],
    sections:[
      {heading:'Kaçağın biçimini kaydedin',paragraphs:['Kaçak sürekli mi, ilk çalıştırmada mı, sıcaklık yükselince mi oluşuyor soruları kök nedeni daraltır. Sökmeden önce damlama noktası, ürün, basınç, sıcaklık ve çalışma süresi kaydedilmelidir. Sadece salmastrayı değiştirmek tekrarlayan arızayı çözmeyebilir.']},
      {heading:'Kuru çalışma ve yetersiz film',paragraphs:['Salmastra yüzeyleri kontrollü bir akışkan filmiyle çalışır. Havasız doldurma yapılmaması, emiş kaybı, yanlış flush veya kristalleşen ürün yüzeyleri kısa sürede aşırı ısıtabilir.'],bullets:['Pompayı üretici prosedürüne göre havasını alarak başlatın.','Flush hattı ve orifisi kontrol edin.','Yüzey malzemesinin ürünle uyumunu doğrulayın.','Salmastra haznesi basınç ve sıcaklığını kaydedin.']},
      {heading:'Mekanik etkiler',paragraphs:['Kaplin hizasızlığı, mil salgısı, rulman boşluğu, kavitasyon ve boru gerilimi salmastra yüzeylerini dinamik olarak ayırabilir. Yeni salmastra takılmadan önce bu ölçümler sınırlarla karşılaştırılmalıdır.']},
      {heading:'Kök neden kaydı',paragraphs:['Sökülen yüzeylerde ısıl çatlak, tek taraflı aşınma, tortu veya elastomer hasarı fotoğraflanır. Bulgular proses ve titreşim verileriyle eşleştirilerek düzeltici faaliyet oluşturulur.']}
    ]
  },
  {
    slug:'redaktor-yag-bakimi-ve-numune',title:'Redüktör Yağ Bakımı ve Yağ Numunesi Alma Rehberi',category:'Redüktör ve Yağlama',
    description:'Redüktörlerde doğru yağ seviyesi, viskozite, numune noktası, su ve metal takibiyle dişli-rulman ömrünü koruyun.',
    standard:'Üretici yağlama şartları ve yağ analizi uygulamaları',source:'Dişli kutusu bakım ve yağ numuneleme prensipleri',revisionDate:REVISION_DATE,relatedTools:[],relatedSystems:['gearbox','bearing'],relatedArticles:['titresim-analizi-baslangic-rehberi','rulman-yaglama-araligi-belirleme'],
    sections:[
      {heading:'Doğru seviye ve doğru yağ',paragraphs:['Seviye kontrol koşulu üreticiye göre duruşta veya çalışmada değişebilir. Fazla yağ çalkalama ve ısı, az yağ film kaybı oluşturur. Viskozite sınıfı yanında baz yağ ve katkı uyumluluğu da doğrulanmalıdır.']},
      {heading:'Temsilî numune',paragraphs:['Numune tortunun dibinden veya taze dolum ağzından değil, aktif yağ bölgesinden aynı yöntemle alınmalıdır. Makine çalışma sıcaklığındayken alınan tekrarlanabilir numuneler trend için daha değerlidir.'],bullets:['Numune kabını temiz ve kapalı tutun.','Nokta, tarih, saat ve çalışma süresini kaydedin.','Yağ ekleme miktarını sonuçla birlikte değerlendirin.','Su, viskozite ve aşınma metalleri trendini izleyin.']},
      {heading:'Havalandırma ve keçeler',paragraphs:['Tıkalı havalık iç basıncı yükseltip keçeden kaçak oluşturabilir. Açık ve kirli havalık ise nem ve partikül girişine izin verir. Ortama uygun desikant veya filtreli havalandırma değerlendirilebilir.']},
      {heading:'Değişim sonrası doğrulama',paragraphs:['Yağ değişimi tek başına kök nedeni gidermez. Metal artışı dişli hasarı, rulman veya hizalama probleminden kaynaklanıyorsa titreşim ve görsel inceleme yapılmalıdır. Değişim sonrası kısa aralıkta kontrol numunesi alınabilir.']}
    ]
  },
  {
    slug:'bakim-checklist-hazirlama-rehberi',title:'Etkili Bakım Checklist’i Nasıl Hazırlanır?',category:'Bakım Yönetimi',
    description:'Bakım checklist maddelerini ölçülebilir kabul kriteri, uygun-uygunsuz-bulgu durumu, fotoğraf ve takip aksiyonuyla tasarlayın.',
    standard:'ISO 55001 yönetim yaklaşımı ve üretici bakım talimatları',source:'Planlı bakım ve saha kalite kontrol uygulamaları',revisionDate:REVISION_DATE,relatedTools:[],relatedSystems:['motor','hydraulic','pneumatic','cnc','bearing'],relatedArticles:['bakim-kpi-mtbf-mttr-rehberi','elektrik-motoru-periyodik-bakim'],
    sections:[
      {heading:'Belirsiz maddeden kaçının',paragraphs:['“Makineyi kontrol et” uygulanabilir bir checklist maddesi değildir. Kontrol noktası, yöntem, kabul sınırı ve uygunsuzlukta yapılacak işlem yazılmalıdır. Örneğin “Rulman DE yatay titreşim değerini aynı yükte ölç; uyarı sınırını aşarsa bulgu aç” daha izlenebilirdir.']},
      {heading:'Durum ve kanıt',paragraphs:['Her madde uygun, uygunsuz veya bulgu olarak işaretlenebilir. Kritik ölçümlerde değer, birim, cihaz ve fotoğraf eklenir. Uygunsuz maddenin yalnızca işaretlenmesi yetmez; sorumlu ve termin içeren takip işi oluşturulmalıdır.'],bullets:['Maddeleri emniyetli uygulama sırasına koyun.','Gerekli takım ve yedek parçayı iş emrine bağlayın.','Normal kabul aralığını açıkça yazın.','Uygulanamaz durumunun gerekçesini kaydedin.']},
      {heading:'Takvim ve saat bazlı görevler',paragraphs:['Temizlik veya yasal kontrol takvim bazlı, rulman veya filtre bakımı çalışma saati bazlı olabilir. Bakım tamamlanınca bir sonraki tarih ya da sayaç eşiği otomatik oluşturulmalıdır.']},
      {heading:'Checklist iyileştirmesi',paragraphs:['Sıkça uygunsuz çıkan, hiç değer üretmeyen veya fazla zaman alan maddeler düzenli gözden geçirilir. Arıza kök nedenlerinden yeni maddeler türetilir; eski revizyonlar izlenebilir tutulur.']}
    ]
  }
];

function articleBodyText(article){
  return article.sections.flatMap(section=>[section.heading,...(section.paragraphs||[]),...(section.bullets||[])]).join('\n\n');
}

function articleSummary(article){
  return {
    slug:article.slug,title:article.title,category:article.category,summary:article.description,
    source:article.source,standard:article.standard,revision_date:article.revisionDate,
    related_tools:article.relatedTools,related_systems:article.relatedSystems,updated_at:`${article.revisionDate}T00:00:00.000Z`
  };
}

module.exports={REVISION_DATE,calculatorSeo,seoArticles,articleBodyText,articleSummary};
