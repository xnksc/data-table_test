import fs from "fs";
import path from "path";
import csvtojson from "csvtojson";

// Обработчик GET запросов
export async function GET() {
  try {
    // Путь к CSV файлу
    const filePath = path.join(
      process.cwd(),
      "app",
      "data",
      "article_def_v_orig.csv"
    );

    // Чтение CSV файла
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Конвертация CSV в JSON
    const jsonArray = await csvtojson().fromString(fileContent);

    // Выборка первых 5 столбцов
    const filteredData = jsonArray.map((item: any) => ({
      articleid: item.articleid,
      subarticleid: item.subarticleid,
      articlename: item.articlename,
      external_str_id: item.external_str_id,
      ecrlongname: item.ecrlongname,
    }));

    return new Response(JSON.stringify(filteredData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Ошибка получение данных:", error);
    return new Response(JSON.stringify({ error: "Ошибка получение данных" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
