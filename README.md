Запуск ``npm start``

В проекте используется **express.Routes()** для создания отдельных
файлов под все запросы по определенному пути.

Сервер возвращает ответы в JSON:

1. /status\
**timeFromLaunch**: hh:mm:ss

2. /api/events\
**data**: Arr,  
**error**: Obj,   
**pagination**: Obj


Объект **Pagination**:\
**currentPage**: Number,\
**nextyPage**: Number,\
**prevPage**: Number,\
**total**: Number

Объект **Error**:\
**msg**: String

Для api/events реализована возможность выполнять и GET и POST запросы
