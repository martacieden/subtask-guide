# Як скинути localStorage для тестування

Щоб побачити початкову форму та welcome popup, потрібно очистити localStorage в браузері:

1. Відкрийте DevTools (F12 або Cmd+Option+I)
2. Перейдіть на вкладку "Application" (або "Storage")
3. В лівій панелі знайдіть "Local Storage" → "http://localhost:3000"
4. Видаліть наступні ключі:
   - way2b1_logged_in
   - way2b1_next_gen_welcome_seen
   - way2b1_user_role
   - way2b1_flow_type
   - way2b1_show_next_gen_welcome
5. Оновіть сторінку (F5 або Cmd+R)

Або виконайте в консолі браузера:
```javascript
localStorage.removeItem('way2b1_logged_in');
localStorage.removeItem('way2b1_next_gen_welcome_seen');
localStorage.removeItem('way2b1_user_role');
localStorage.removeItem('way2b1_flow_type');
localStorage.removeItem('way2b1_show_next_gen_welcome');
location.reload();
```
