import React, { useEffect, useState } from "react";
import { getCategories, getItems } from "@/services/productService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Menu = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, itemsRes] = await Promise.all([
          getCategories(),
          getItems()
        ]);
        const categories = (catRes.data.data || catRes.data.items || []).map(cat => ({
          id: String(cat.id),
          name: cat.attributes?.name || "بدون اسم",
          description: cat.attributes?.description || "",
        }));
        const items = (itemsRes.data.data || itemsRes.data.items || []).map(item => ({
          id: item.id,
          name: item.attributes?.name || "بدون اسم",
          description: item.attributes?.description || "",
          price: item.attributes?.price || 0,
          image: item.attributes?.image_url || "",
          type: item.attributes?.type || "",
          category: String(item.relationship?.menuCategory?.id) || "غير مصنف",
        }));
        setCategories(categories);
        setItems(items);
      } catch (err) {
        console.error("خطأ في جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // تصفية المنتجات حسب التصنيف والبحث
  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        <span className="ml-2">جاري تحميل البيانات...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[url('/images/pexels-nano-erdozain-120534369-27643000.jpg')] bg-cover bg-center text-white h-screen flex justify-center items-center">
        <div className="container mx-auto px-4 text-center h-screen  bg-[rgba(0,0,0,.3)] flex justify-center items-center ">
          <div>
            <h1 className="font-arabic text-5xl font-bold mb-4">
              منيو مطعم أبراهيم باشا
            </h1>
            <p className="text-xl opacity-90">
              اكتشف مجموعتنا المتنوعة من الأطباق الشهية والمشروبات المنعشة
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-restaurant-brown">قائمة الطعام</h1>
        {/* شريط البحث */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pr-10 text-right"
            />
          </div>
        </div>
        <div className="mb-8"></div>
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <Button
              onClick={() => setSelectedCategory("all")}
              variant={selectedCategory === "all" ? 'default' : 'outline'}
            >
              عرض الكل
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
              >
                {cat.name}
              </Button>
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-500">
            عدد التصنيفات المتاحة: {categories.length}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">لا توجد منتجات مطابقة</div>
          ) : (
            filteredItems.map(item => (
              <Card key={item.id} className="shadow-md hover:shadow-lg transition">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
                  <CardDescription className="text-gray-500">{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-restaurant-brown">{item.price} ر.س</span>
                    <span className="text-sm text-gray-400">
                      {categories.find(cat => cat.id === item.category)?.name || "غير مصنف"}
                    </span>
                  </div>
                  <div className="mb-2 text-sm text-gray-500">النوع: {item.type}</div>
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-40 object-cover rounded" />}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
  );
};

export default Menu;
      