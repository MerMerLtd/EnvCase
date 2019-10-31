//來源： http://sask989.blogspot.com/2012/05/wgs84totwd97.html
// 👆他參考的是： http://wangshifuola.blogspot.com/2010/08/twd97wgs84-wgs84twd97.html

const a = 6378137.0; //地球赤道半徑(Equatorial Radius)
const b = 6356752.3142451; //兩極半徑(Polar Radius)
let lon0 = 121 * Math.PI / 180; //中央經線弧度
let k0 = 0.9999; //中央經線尺度比。在TM投影中常用的帶寬是2度，3度，6度。尺度比一般規定：2度 0.9999、3度 1.0000、6度 0.9996
let dx = 250000;
let dy = 0;
let e = 1 - Math.pow(b, 2) / Math.pow(a, 2);
let e2 = (1 - Math.pow(b, 2) / Math.pow(a, 2)) / (Math.pow(b, 2) / Math.pow(a, 2));

//給WGS84經緯度度分秒轉成TWD97坐標
function lonlat_To_twd97(lonD, lonM, lonS, latD, latM, latS) {
    let RadianLon = (lonD) + lonM / 60 + lonS / 3600;
    let RadianLat = (latD) + latM / 60 + latS / 3600;
    return Cal_lonlat_To_twd97(RadianLon, RadianLat);
}

//給WGS84經緯度弧度轉成TWD97坐標
function lonlat_To_twd97(RadianLon, RadianLat) {
    return Cal_lonlat_To_twd97(RadianLon, RadianLat);
}

//給TWD97坐標 轉成 WGS84 度分秒字串 (type1傳度分秒 2傳弧度)
function TWD97_To_lonlat(XValue, YValue, Type) {

    let lonlat = "";

    if (Type == 1) {
        let Answer = Cal_TWD97_To_lonlat(XValue, YValue).Split(',');
        let LonDValue = double.Parse(Answer[0]);
        let LonMValue = ((double.Parse(Answer[0]) - LonDValue) * 60);
        let LonSValue = (((double.Parse(Answer[0]) - LonDValue) * 60) - LonMValue) * 60;

        let LatDValue = double.Parse(Answer[1]);
        let LatMValue = ((double.Parse(Answer[1]) - LatDValue) * 60);
        let LatSValue = (((double.Parse(Answer[1]) - LatDValue) * 60) - LatMValue) * 60;

        lonlat = LonDValue + "度" + LonMValue + "分" + LonSValue + "秒," + LatDValue + "度" + LatMValue + "分" + LatSValue + "秒,";
    } else if (Type == 2) {
        lonlat = Cal_TWD97_To_lonlat(XValue, YValue);
    }

    return lonlat;
}

function Cal_lonlat_To_twd97(lon, lat) {
    let TWD97 = "";

    lon = (lon - Math.floor((lon + 180) / 360) * 360) * Math.PI / 180;
    lat = lat * Math.PI / 180;

    let V = a / Math.sqrt(1 - e * Math.pow(Math.sin(lat), 2));
    let T = Math.pow(Math.tan(lat), 2);
    let C = e2 * Math.pow(Math.cos(lat), 2);
    let A = Math.cos(lat) * (lon - lon0);
    let M = a * ((1.0 - e / 4.0 - 3.0 * Math.pow(e, 2) / 64.0 - 5.0 * Math.pow(e, 3) / 256.0) * lat -
        (3.0 * e / 8.0 + 3.0 * Math.pow(e, 2) / 32.0 + 45.0 * Math.pow(e, 3) / 1024.0) *
        Math.sin(2.0 * lat) + (15.0 * Math.pow(e, 2) / 256.0 + 45.0 * Math.pow(e, 3) / 1024.0) *
        Math.sin(4.0 * lat) - (35.0 * Math.pow(e, 3) / 3072.0) * Math.sin(6.0 * lat));
    // x
    let x = dx + k0 * V * (A + (1 - T + C) * Math.pow(A, 3) / 6 + (5 - 18 * T + Math.pow(T, 2) + 72 * C - 58 * e2) * Math.pow(A, 5) / 120);
    // y
    let y = dy + k0 * (M + V * Math.tan(lat) * (Math.pow(A, 2) / 2 + (5 - T + 9 * C + 4 * Math.pow(C, 2)) * Math.pow(A, 4) / 24 + (61 - 58 * T + Math.pow(T, 2) + 600 * C - 330 * e2) * Math.pow(A, 6) / 720));

    TWD97 = x.toString() + "," + y.toString();
    return TWD97;
}

function Cal_TWD97_To_lonlat(x, y) {
    x -= dx;
    y -= dy;

    // Calculate the Meridional Arc
    let M = y / k0;

    // Calculate Footprint Latitude
    let mu = M / (a * (1.0 - e / 4.0 - 3 * Math.pow(e, 2) / 64.0 - 5 * Math.pow(e, 3) / 256.0));
    let e1 = (1.0 - Math.sqrt(1.0 - e)) / (1.0 + Math.sqrt(1.0 - e));

    let J1 = (3 * e1 / 2 - 27 * Math.pow(e1, 3) / 32.0);
    let J2 = (21 * Math.pow(e1, 2) / 16 - 55 * Math.pow(e1, 4) / 32.0);
    let J3 = (151 * Math.pow(e1, 3) / 96.0);
    let J4 = (1097 * Math.pow(e1, 4) / 512.0);

    let fp = mu + J1 * Math.sin(2 * mu) + J2 * Math.sin(4 * mu) + J3 * Math.sin(6 * mu) + J4 * Math.sin(8 * mu);

    // Calculate Latitude and Longitude
    let C1 = e2 * Math.pow(Math.cos(fp), 2);
    let T1 = Math.pow(Math.tan(fp), 2);
    let R1 = a * (1 - e) / Math.pow((1 - e * Math.pow(Math.sin(fp), 2)), (3.0 / 2.0));
    let N1 = a / Math.pow((1 - e * Math.pow(Math.sin(fp), 2)), 0.5);

    let D = x / (N1 * k0);

    // 計算緯度
    let Q1 = N1 * Math.tan(fp) / R1;
    let Q2 = (Math.pow(D, 2) / 2.0);
    let Q3 = (5 + 3 * T1 + 10 * C1 - 4 * Math.pow(C1, 2) - 9 * e2) * Math.pow(D, 4) / 24.0;
    let Q4 = (61 + 90 * T1 + 298 * C1 + 45 * Math.pow(T1, 2) - 3 * Math.pow(C1, 2) - 252 * e2) * Math.pow(D, 6) / 720.0;
    let lat = fp - Q1 * (Q2 - Q3 + Q4);

    // 計算經度
    let Q5 = D;
    let Q6 = (1 + 2 * T1 + C1) * Math.pow(D, 3) / 6;
    let Q7 = (5 - 2 * C1 + 28 * T1 - 3 * Math.pow(C1, 2) + 8 * e2 + 24 * Math.pow(T1, 2)) * Math.pow(D, 5) / 120.0;
    let lon = lon0 + (Q5 - Q6 + Q7) / Math.cos(fp);

    lat = (lat * 180) / Math.PI; //緯度
    lon = (lon * 180) / Math.PI; //經度

    let lonlat = lon + "," + lat;
    let latlng = [lat, lon];
    return latlng;
}

