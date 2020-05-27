# gulp-test

需要使用git init的方式

1.先CD到專案資料夾

輸入git初始化repo

<git init>

2.設定個人資料

這邊請不要這樣打

git config --global user.name 名稱
git config --global user.email email
請這樣打 去除--global

<git config user.name 名稱>
<git config user.email email>
3.輸入遠程位置

<git remote add origin "YourGithub_URL">

4.將資料加入

<git add .>

5.寫入commit

<git commit -m "first">

6.接下來就可以push source囉

<git push origin master>

7.此時再執行發佈到page

<gulp deploy>

就可以上github分支上面看到已經上傳成功囉
