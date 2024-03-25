import React, { useEffect } from 'react';
import tw, { styled } from 'twin.macro';
import newDong from '../../datas/newDong.json';
import UseAxios from '../../utils/UseAxios.tsx';
import './content.css';

interface KakaoMapProps {
  areaName: string;
  selectedBuildingRef: React.MutableRefObject<any>;
  setBuildingId: React.Dispatch<React.SetStateAction<number>>;
  setMarkerList: React.Dispatch<React.SetStateAction<any>>;
  setBuildingMap: React.Dispatch<React.SetStateAction<any>>;
  markerList: any;
}

type Building = {
  x: number;
  y: number;
  buildingId: number;
};

const MapWrapper = styled.div`
  ${tw`w-[75%] h-[100%]
  max-sm:w-[100%]`}
`;
const Map = styled.div`
  ${tw`w-[100] h-[100%]`}
`;

const { kakao } = window;

const imageSrc = 'https://github.com/jjm6604/react-test/blob/main/Group%2021%20(1).png?raw=true';
const selectedImageSrc = 'https://github.com/jjm6604/react-test/blob/main/bluehouse.png?raw=true';
const imageSize = new kakao.maps.Size(25, 25);
const selectedImageSize = new kakao.maps.Size(30, 30);
const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
const selectedMarkerImage = new kakao.maps.MarkerImage(selectedImageSrc, selectedImageSize);

function KakaoMap({
  areaName,
  selectedBuildingRef,
  setBuildingId,
  setMarkerList,
  setBuildingMap,
  markerList,
}: KakaoMapProps) {
  const axios = UseAxios();
  const selectedDong: any = newDong.features.find((dong: any) => dong.properties.temp === areaName);
  const x = selectedDong.properties.x;
  const y = selectedDong.properties.y;

  const clickOverlay = (buildingId: number) => {
    if (selectedBuildingRef.current !== null) {
      selectedBuildingRef.current.setImage(markerImage);
    }
    setBuildingId(buildingId);
    const marker = markerList[buildingId];
    console.log(markerList);
    selectedBuildingRef.current = marker;
    marker.setImage(selectedMarkerImage);
  };

  // 카카오톡 지도 생성
  useEffect(() => {
    const container = document.getElementById('map');
    const options = {
      center: new kakao.maps.LatLng(y, x),
      level: 4,
      draggable: true,
      scrollwheel: true,
      disableDoubleClickZoom: true,
    };
    const map = new kakao.maps.Map(container, options);
    setBuildingMap(map);
    // 폴리곤 생성
    const polygonPath = selectedDong.geometry.coordinates[0].map((coordinate: any) => {
      return new kakao.maps.LatLng(coordinate[1], coordinate[0]);
    });

    const polygon = new kakao.maps.Polygon({
      path: polygonPath,
      strokeWeight: 4,
      strokeColor: '#000000',
      strokeOpacity: 0.7,
      fillColor: '#ffffff',
      fillOpacity: 0.3,
    });
    polygon.setMap(map);

    // 클러스터러 , 마커

    const clusterer = new kakao.maps.MarkerClusterer({
      map: map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
      averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
      disableClickZoom: true,
      minLevel: 1, // 클러스터 할 최소 지도 레벨
      calculator: [3, 5, 10, 30, 50, 100, 500, 1000], // 클러스터의 크기 구분 값, 각 사이값마다 설정된 text나 style이 적용된다
      texts: ['2', '3+', '5+', '10+', '30+', '50+', '100+', '500+', '1000+'],
      styles: [
        {
          // calculator 각 사이 값 마다 적용될 스타일을 지정한다
          width: '30px',
          height: '30px',
          background: `url("${imageSrc}") round`,
          color: '#fff', // 글자색
          // opacity: '0.7',
          border: 'black',
          // borderRadius: '100px',
          textAlign: 'center',
          fontWeight: 'bold',
          lineHeight: '31px',
          paddingTop: '8px',
        },
        {
          width: '35px',
          height: '35px',
          lineHeight: '36px',
        },
        {
          width: '40px',
          height: '40px',
          lineHeight: '41px',
        },
        {
          width: '45px',
          height: '45px',
          lineHeight: '46px',
        },
        {
          width: '50px',
          height: '50px',
          lineHeight: '51px',
        },
        {
          width: '55px',
          height: '55px',
          lineHeight: '56px',
        },
        {
          width: '60px',
          height: '60px',
          lineHeight: '61px',
        },
        {
          width: '65px',
          height: '65px',
          lineHeight: '66px',
        },
        {
          width: '70px',
          height: '70px',
          lineHeight: '71px',
        },
        {
          width: '70px',
          height: '70px',
          lineHeight: '71px',
        },
        {
          width: '70px',
          height: '70px',
          lineHeight: '71px',
        },
      ],
    });

    kakao.maps.event.addListener(clusterer, 'clusterclick', function (cluster: any) {
      const level = map.getLevel();
      if (level >= 2) {
        const newLevel = level - 2;
        map.setCenter(cluster.getCenter());
        map.setLevel(newLevel ? newLevel : 1);
      } else {
        const clusterMarkers = cluster.getMarkers();
        const buildingIdList = clusterMarkers.map((marker: any) => Number(marker.getTitle()));

        axios
          .post('/api/buildings/detail', {
            buildingIdList: buildingIdList,
          })
          .then((response) => {
            console.log(response.data);
            let content = `
            <div class="contentStyle">
              <p>매물 List</p>
              <div id="closeButton">여기 닫는버튼임</div>
              <ul>
              `;

            response.data.object.forEach((building: any) => {
              content += `<li id=${building.buildingId}> [${building.buildingType}]${building.name} ${building.payType}${building.deposit}/${building.monthlyPay} </li>`;
            });

            content += `</ul></div>`;
            const customOverlay = new kakao.maps.CustomOverlay({
              map: map,
              clickable: true,
              content: content,
              position: cluster.getCenter(),
              xAnchor: 0.5,
              yAnchor: 1,
              zIndex: 3,
            });
            customOverlay.setMap(map);
            const closeOverlay = () => {
              map.setZoomable(true);
              customOverlay.setMap(null);
            };

            document.getElementById('closeButton')?.addEventListener('click', closeOverlay);
            response.data.object.forEach((building: any) => {
              document
                .getElementById(`${building.buildingId}`)
                ?.addEventListener('click', () => clickOverlay(building.buildingId));
            });
          })
          .catch((error) => {
            console.log(error);
          });

        map.setZoomable(false);
      }
    });

    // 데이터에서 좌표 값을 가지고 마커를 표시합니다
    // 마커 클러스터러로 관리할 마커 객체는 생성할 때 지도 객체를 설정하지 않습니다
    axios
      .get('/api/buildings', { params: { dongname: '역삼동' } })
      .then((response) => {
        console.log(response.data);
        const markermarker: any = {};
        const markers = response.data.object.map((building: Building) => {
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(building.x, building.y),
            image: markerImage,
            title: building.buildingId,
          });
          kakao.maps.event.addListener(marker, 'click', function () {
            if (selectedBuildingRef.current !== null) {
              selectedBuildingRef.current.setImage(markerImage);
            }
            setBuildingId(marker.getTitle());
            selectedBuildingRef.current = marker;
            marker.setImage(selectedMarkerImage);
          });
          markermarker[building.buildingId] = marker;
          return marker;
        });
        clusterer.addMarkers(markers);

        setMarkerList(markermarker);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <MapWrapper>
      <Map id="map" />
    </MapWrapper>
  );
}

export default KakaoMap;
