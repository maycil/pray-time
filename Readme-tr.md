
# Namaz vakti hesaplamalrı
Namaz vakti hesaplaması, aşağıdaki trigonometri ve trigonometrik formüllere dayanmaktadır. Saat açısı (w) ve yükseklik açısı (α) kilit noktadır. Sabah(Fecir bitişi), öğle ve akşam vakitleri bu iki parametre ile hesaplanır. Öğle vakti için saat açısı 180 ve yükseklik açısı en yüksek değerdir. Sabah(Fecir bitişi) ve Akşam için yükseklik açısı sıfırdır.

  
| Değişken | Açıklama |
| -------- | -------- |
|α, İrtifa Açısı (Altitude Angle)| Güneş'in ufuk düzleminden dikey olarak olan açısal yüksekliği. Namaz vakitlerinin hesaplanmasında temel açıdır.|
|δ, Meyil Açısı (Declination Angle)| Güneş'in o günkü Ekvator düzlemine olan açısal uzaklığı. Yıl boyunca ≈−23.45∘ (kış gündönümü) ile ≈+23.45∘ (yaz gündönümü) arasında değişir.|
|φ, Gözlemcinin Enlemi (Observer’s Latitude)| Namaz vakitlerinin hesaplandığı yerin coğrafi enlemi.|
|ω, Saat Açısı (Hour Angle)| Güneş'in yerel meridyenden doğuya veya batıya olan açısal uzaklığı. Öğle vaktinde (ω=0) ve gece yarısında (ω=180∘) en kolay hesaplanır.|


    sinα = sinδ * sin φ + cosδ * cos ω * cos φ 
    cos ω = (sinα - sinδ * sin φ) / (cosδ * cos φ)  m


# Şafak Vakti 

Şafak zamanı, yükseklik açısı -18 derece olarak ayarlanarak hesaplanır. Bu, astronomik alacakaranlık olarak da bilinir. Ardından, hesaplanan zamandan tulu zamanı çıkarılır.


	α = -18;
    cos ω = (sinα - sinδ * sin φ) / (cosδ * cos φ)  
	dawnTime =  tuluTime -  acos(ω) * 4


# Fecir Başlangıç Vakti 

Fajr başlangıç zamanı, yükseklik açısı (α) -9 derece olarak ayarlanarak hesaplanır.  Ardından, hesaplanan zamandan öğlen vakti çıkarılır.

	α = -9;
    cos ω = (sinα - sinδ * sin φ) / (cosδ * cos φ)  
	fajrBeginTime =  tuluTime -  acos(ω) * 4


# Fecir Bitiş Vakti 

Fecir bitiş zamanı, yükseklik açısının sıfır derece olarak ayarlanmasıyla hesaplanmalıdır. Ancak güneşin tamamen kaybolması -1 derece ile sağlanır.Burada atmosferik ektisinden dolayı güneş -0,83 derece geldiğinde doğduduğu/battığı hissi oluşturuğu için sıfır yerine -1 değeri seçilmiştir. Fecir bitiş zamanını bulmak için, hesaplanan zamandan tulu zamanı çıkarılır.

	α = -1;
    cos ω = (sinα - sinδ * sin φ) / (cosδ * cos φ)  
	fajrEndTime =  tuluTime -  acos(ω) * 4

# Öğle Vakti (tuluTime)

Belirli bir konum için güneş öğle vakti, enlem (derece cinsinden, baş meridyenin doğusunda pozitif) ve zaman denklemi dakika cinsinden ile bulunur:

tuluTime = 720 – 4*longitude – eqtime

# Denklem Zaman Hesaplama (EoT)

Denklem Zaman Hesaplaması aşağıdaki formülle yaklaşık olarak hesaplanabilir:

	EoT = 9.87 * sin (2B) - 7.53 * cos (B) - 1.5 * sin (B)
	B = 360 * (N - 81) / 365
	N = day number, January 1 = day 1
  

# İkindi Vakti: (asrTime)

İkindi zamanı öğlen ve maghribin ortasındadır. Asr zamanını bulmak için, tulu zamanı hesaplanan zamanla toplanır.
	
	α = -1;
    cos ω = (sinα - sinδ * sin φ) / (cosδ * cos φ)  
	asrTime =  tuluTime +  acos(ω) / 2 * 4	 

# Akşam Vakti: (maghribTime)

Akşam vakti, yükseklik açısı sıfır derece olarak ayarlanarak hesaplanır. Ancak güneşin tamamen kaybolması -1 derece ile sağlanır. Akşam vaktini bulmak için, öğle vakti ile hesaplanan değer toplanır.

	α = -1;
    cos ω = (sinα - sinδ * sin φ) / (cosδ * cos φ)  
	asrTime =  tuluTime +  acos(ω) * 4
	 

# Yatsı Vakti: (ishaTime)

Yatsı vakti, yükseklik açısı -9 derece olarak ayarlanarak hesaplanır. Ardından öğle vakti ile hesaplanan değer toplanır.

	α = -9;
    cos ω = (sinα - sinδ * sin φ) / (cosδ * cos φ)  
	ishaTime =  tuluTime +  acos(ω) * 4

# Yatsı Bitiş Vakti: (ishaEndTime)

Yatsının bitiş vakti, yükseklik açısı -18 derece olarak ayarlanarak hesaplanır. Bu, astronomik alacakaranlık olarak da bilinir. Yatsı bitiş vakti öğle vakti ile hesaplanan değer toplanır.

	α = -18;
    cos ω = (sinα - sinδ * sin φ) / (cosδ * cos φ)  
	ishaEndTime =  tuluTime +  acos(ω) * 4
	 
	
# Yükseklik Açısı

Yükseklik açısı, ufuk çizgisinden ölçülen güneşin gökyüzündeki açısal yüksekliğidir.

Yükseklik, α, aşağıdaki formül kullanılarak herhangi bir zamanda bulunabilir:


    ω = saat açısı
	  α = irtifa/yükseklik açısı
    δ = meyil/deklinasyon açısı
    φ = gözlemcinin açısı

    sinα = sinδ * sin φ + cosδ * cos ω * cos φ 

	Öğle vakti için :

    eğer saat açısı 180 olursa;
    ω = 180;

    sinα = sinδ * sin φ  - cosδ *  cos φ 

	 
	eğer cos(X + Y) = cosX cosY - sinX sinY

    cos(φ + δ)  = -1* (cos φ * cosδ  - sin φ * sinδ)  
	
	  sinα =  -1 * cos(φ + δ)
	
	  cos(90 - α) =  -1 * cos(φ + δ)

	eğer cosX = -cosY  ise cosX = cos(180 +/- Y)

    90 - α = 180 - (φ + δ)

    α = 90 - (180 - φ - δ)

	  α= 90 - |φ-δ| 
	

# Referanslar:

Trigonometri  	:	https://www.analyzemath.com/trigonometry/trigonometric_formulas.html

İrtifa Açısı    :	https://www.pveducation.org/pvcdrom/properties-of-sunlight/elevation-angle

Öğle Vakti 		  :	https://www.esrl.noaa.gov/gmd/grad/solcalc/solareqns.PDF

Zaman Denklemi  :	https://www.pveducation.org/pvcdrom/properties-of-sunlight/solar-time

Declination		:  https://www.pveducation.org/pvcdrom/properties-of-sunlight/declination-angle


