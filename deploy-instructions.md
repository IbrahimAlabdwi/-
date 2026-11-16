# 🚀 دليل نشر موقع "حكاية فايا" على الإنترنت مجانًا

الموقع جاهز الآن في مجلد `faya/`. لإعطائك رابطًا يمكنك مشاركته مع أيمن ومها، اتبع أحد الطرق التالية (كلها مجانية):

---

## الطريقة الأسهل: Netlify Drop (بدون حساب، بدون تثبيت) ⭐

### الخطوات:
1. افتح المتصفح واذهب إلى: **[https://app.netlify.com/drop](https://app.netlify.com/drop)**
2. **اسحب مجلد `faya` كامل** وأفلته في الدائرة في وسط الصفحة
3. انتظر ثوانٍ... سيتحول المجلد إلى رابط مباشر!
4. اضغط على الرابط → سيظهر لك مثل هذا: `https://fluffy-kibbeh-123456.netlify.app/`
5. اضغط **"Site Settings" → "Change site name"** واجعل الاسم: `hikayet-faya` أو `faya-princess`
6. الرابط النهائي سيكون: **`https://hikayet-faya.netlify.app`** ✅

✅ **انسخ الرابط وأرسله لأيمن عبر واتساب!**

---

## الطريقة الثانية: GitHub Pages (إذا كان عندك حساب GitHub)

### الخطوات:
1. اذهب إلى [github.com/new](https://github.com/new)
   - اسم المستودع: `faya-story`
   - اجعله **Public**
   - ضع علامة ✅ على *"Add a README file"*
   - اضغط **Create repository**

2. انسخ الكود التالي (اكتبه في PowerShell لتوليد ملف .nojekyll):
```powershell
New-Item -Path "C:\Users\ibrah\Desktop\ayoom\faya\.nojekyll" -ItemType File -Force
```

3. من صفحة المستودع على GitHub:
   - اضغط **Add file → Upload files**
   - اسحب وأفلت **كل ملفات** داخل مجلد `faya/` (index.html, css/, js/, README.md)
   - اضغط **Commit changes**

4. اذهب إلى **Settings → Pages** (من القائمة الجانبية)
   - في قسم **Source** اختر `main branch`
   - في **Folder** اختر `/(root)`
   - اضغط **Save**

5. بعد دقيقة سيتحول الموقع متاحًا على:
   **`https://<اسم-الحساب>.github.io/faya-story/`**

---

## الطريقة الثالثة: Surge.sh (سريعة جدًا)

افتح PowerShell في مجلد `faya` واكتب:
```bash
npm install -g surge
cd C:\Users\ibrah\Desktop\ayoom\faya
surge
```
سيقوم بإنشاء رابط عشوائي. غيّره بإعادة تشغيل الأمر بنفس المكتبة.

---

## ✅ أنصحك بالطريقة الأولى (Netlify Drop) — لأنها:
- لا تحتاج تسجيل حساب
- لا تحتاج git أو GitHub
- تستغرق أقل من دقيقتين
- تعطيك رابطًا دائمًا ومستقرًا
- مجانية 100%
- تدعم HTTPS تلقائيًا

بعد الحصول على الرابط، شاركه مع أيمن عبر واتساب أو أي وسيلة أخرى! 🎉
