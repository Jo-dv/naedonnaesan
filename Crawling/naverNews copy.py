#크롤링시 필요한 라이브러리 불러오기
from bs4 import BeautifulSoup
import requests
import re
from tqdm import tqdm
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from datetime import datetime, timedelta
from time import sleep

# 페이지 url 형식에 맞게 바꾸어 주는 함수 만들기
  #입력된 수를 1, 11, 21, 31 ...만들어 주는 함수
def makePgNum(num):
    if num == 1:
        return num
    elif num == 0:
        return num+1
    else:
        return num+9*(num-1)

# 크롤링할 url 생성하는 함수 만들기(검색어, 크롤링 시작 페이지, 크롤링 종료 페이지)

from datetime import datetime, timedelta


# 어제 날짜를 'YYYY.MM.DD' 형식으로 반환하는 함수
def get_yesterday_date():
    yesterday = datetime.now() - timedelta(days=1)
    return yesterday.strftime('%Y.%m.%d')

# Selenium을 사용하여 기사 URL 수집하는 함수
def articles_crawler_with_selenium(search):
    service = Service(executable_path='/path/to/chromedriver')  # ChromeDriver 경로
    driver = webdriver.Chrome(service=service)

    all_urls = []
    start_pg = 1
    end_pg = 2  # 최대 페이지 수 설정 (임시로 2로 설정, 필요에 따라 조정)
    yesterday_date = get_yesterday_date()

    try:
        for i in range(start_pg, end_pg + 1):
            page = makePgNum(i)
            url = f"https://search.naver.com/search.naver?where=news&query={search}&sm=tab_opt&sort=1&reporter_article=&pd=3&ds={yesterday_date}&de={yesterday_date}&docid=&mynews=0&start={page}"
            driver.get(url)
            # sleep(2)  # 페이지 로딩 대기

            html = driver.page_source
            soup = BeautifulSoup(html, 'html.parser')
            news_links = soup.select("div.group_news > ul.list_news > li div.news_area > div.news_info > div.info_group > a.info")

            for link in news_links:
                all_urls.append(link['href'])

    finally:
        driver.quit()

    return all_urls




# 크롤링할 url 생성하는 함수 수정
def makeUrl(search, start_pg, end_pg):
    urls = []
    yesterday_date = get_yesterday_date()  # 어제 날짜 계산
    for i in range(start_pg, end_pg + 1):
        page = makePgNum(i)
        # 어제 날짜를 기준으로 URL 생성
        url = f"https://search.naver.com/search.naver?where=news&query={search}&sm=tab_opt&sort=1&reporter_article=&pd=3&ds={yesterday_date}&de={yesterday_date}&docid=&mynews=0&start={page}"
        print(str(url))
        urls.append(url)
    return urls

# html에서 원하는 속성 추출하는 함수 만들기 (기사, 추출하려는 속성값)
def news_attrs_crawler(articles,attrs):
    attrs_content=[]
    for i in articles:
        attrs_content.append(i.attrs[attrs])
    return attrs_content

# ConnectionError방지
# headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"}
import time
#html생성해서 기사크롤링하는 함수 만들기(url): 링크를 반환
def articles_crawler(urls):
    all_urls = []
    #  # urls 변수가 리스트가 아니라 단일 문자열일 경우, 리스트로 변환
    # if isinstance(urls, str):
    #     urls = [urls]
    for url in urls:
        original_html = requests.get(url, headers={'User-agent':'Mozila/5.0'})
        print("오리지날 html : " + str(original_html))
        html = BeautifulSoup(original_html.text, "html.parser")

        time.sleep(1)  # 1초 대기
        
        url_naver = html.select("div.group_news > ul.list_news > li div.news_area > div.news_info > div.info_group > a.info")
        print("url_naver : " + str(url_naver))
        if not url_naver:  # 기사가 더 이상 없는 경우
            break  # 크롤링 종료
        
        single_urls = news_attrs_crawler(url_naver, 'href')
        all_urls.extend(single_urls)
    return all_urls



import pandas as pd

# CSV 파일 불러오기
df = pd.read_csv("Clustering/편의시설 변경 버전.csv", encoding='cp949')  # '파일경로.csv'를 실제 파일 경로로 변경하세요.

# '법정동명' 컬럼을 리스트로 변환
dong_list = df['법정동명'].unique().tolist()


# dong_list 내의 각 검색어에 대해 크롤링 실행
news_urls = []
for search in dong_list:
    print(f"검색어: {search}에 대한 크롤링 시작")
    # articles_crawler 함수를 사용하여 해당 검색어에 대한 뉴스 URL 수집

    # urls = makeUrl(search, 1, 1)
    # print("urls : " + str(urls))
    # news_urls.append(articles_crawler(urls))
    news_urls.append(articles_crawler_with_selenium(search))
    # 수집된 뉴스 URL 개수 출력
    print(f"검색어: {search}, 수집된 뉴스 URL 개수: {len(news_urls)}")


# naver url 생성
# urls = makeUrl(search,page,page2)
# print("urls : " + str(urls))
#뉴스 크롤러 실행
news_titles = []
news_url =[]
news_contents =[]
news_images = []
news_dates = []
# 뉴스 크롤러 실행 부분 수정
# news_urls = []

## urls
# urls_list = articles_crawler(urls)
# news_urls.extend(urls_list)

print("news_urls : " + str(news_urls))
#제목, 링크, 내용 1차원 리스트로 꺼내는 함수 생성
# def makeList(newlist, content):
#     for i in content:
#         for j in i:
#             newlist.append(j)
#     return newlist

    
#제목, 링크, 내용 담을 리스트 생성
news_url_1 = news_urls

#1차원 리스트로 만들기(내용 제외)
# makeList(news_url_1,news_urls)

print("news_url_1 : " + str(news_url_1))
#NAVER 뉴스만 남기기
final_urls = []
for i in tqdm(range(len(news_url_1))):
    if "n.news.naver.com" in news_url_1[i]:
        final_urls.append(news_url_1[i])
    else:
        pass

# 뉴스 내용 크롤링

print("final_urls : " + str(final_urls))
for i in tqdm(final_urls):
    #각 기사 html get하기
    news = requests.get(i,headers=headers)
    news_html = BeautifulSoup(news.text,"html.parser")

    # 뉴스 제목 가져오기
    title = news_html.select_one("#ct > div.media_end_head.go_trans > div.media_end_head_title > h2")
    if title == None:
        title = news_html.select_one("#content > div.end_ct > div > h2")
    
    # 뉴스 본문 가져오기
    content = news_html.select("article#dic_area")
    if content == []:
        content = news_html.select("#articeBody")
    
    #articeBody > span:nth-child(2)
    # 뉴스 썸네일 이미지 가져오기
    #dic_area > span:nth-child(4)
    picture = news_html.select("#ct > #contents > #newsct_article > #dic_area > span > div > div > #img1")
    # picture = news_html.select("span#end_photo_org > #img1")
    # 기사 텍스트만 가져오기
    # list합치기
    content = ''.join(str(content))

    # html태그제거 및 텍스트 다듬기
    pattern1 = '<[^>]*>'
    title = re.sub(pattern=pattern1, repl='', string=str(title))
    content = re.sub(pattern=pattern1, repl='', string=content)
    pattern2 = """[\n\n\n\n\n// flash 오류를 우회하기 위한 함수 추가\nfunction _flash_removeCallback() {}"""
    content = content.replace(pattern2, '')

    news_images.append(picture)
    news_titles.append(title)
    news_contents.append(content)

    try:
        html_date = news_html.select_one("div#ct> div.media_end_head.go_trans > div.media_end_head_info.nv_notrans > div.media_end_head_info_datestamp > div > span")
        news_date = html_date.attrs['data-date-time']
    except AttributeError:
        news_date = news_html.select_one("#content > div.end_ct > div > div.article_info > span > em")
        news_date = re.sub(pattern=pattern1,repl='',string=str(news_date))
    # 날짜 가져오기
    news_dates.append(news_date)

news_images_src = []
for img_list in news_images:
    # 이미지 리스트가 비어있지 않은 경우에만 처리
    if img_list:
        # 리스트 내의 각 이미지 태그에 대해 data-src 추출
        src_list = [img.get('data-src') for img in img_list if img.get('data-src') is not None]
        news_images_src.append(src_list)
    else:
        # 이미지가 없는 경우 빈 리스트 추가
        news_images_src.append([])


# print("검색된 기사 갯수: 총 ",(page2+1-page)*10,'개')
# print("검색된 기사 갯수: 총 ",news_t'개')
print("\n[뉴스 제목]")
print(news_titles)
print("\n[뉴스 링크]")
print(final_urls)
print("\n[뉴스 이미지]")
print(news_images_src)
print("\n[뉴스 내용]")
print(news_contents)

print('news_title: ',len(news_titles))
print('news_url: ',len(final_urls))
print('news_contents: ',len(news_contents))
print('news_dates: ',len(news_dates))

###데이터 프레임으로 만들기###
import pandas as pd

#데이터 프레임 만들기
news_df = pd.DataFrame({'date':news_dates,'title':news_titles,'link':final_urls, 'images': news_images_src, 'content':news_contents})


# 리스트를 문자열로 변환
news_df['images'] = news_df['images'].apply(lambda x: ', '.join(x))

#중복 행 지우기
news_df = news_df.drop_duplicates(keep='first',ignore_index=True)
print("중복 제거 후 행 개수: ",len(news_df))

#데이터 프레임 저장
now = datetime.now() 
news_df.to_csv('{}_{}.csv'.format(search,now.strftime('%Y%m%d_%H시%M분%S초')),encoding='utf-8-sig',index=False)