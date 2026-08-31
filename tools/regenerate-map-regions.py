# -*- coding: utf-8 -*-
"""
地图 5 大区域省份轮廓重生成

旧 china-regions.js 由 one-step-output/tools/_region_provinces.js 生成，
几何 y 坐标全聚在 350-360 一条横线上（疑似生成时数据错位），导致 map.html
切到任意区域都只看到几条横线。重新从源 china-provinces.json 投影。

投影：等距矩形（lon/lat 各自线性归一化）。比 Mercator 在窄纬度区域更稳定，
且不引入视觉畸变（地图是文化分区示意，不是航海图）。

区域（按各区内省份实际 bbox 略微内缩，含 buffer）：
  nw  西北  lon 73-108   lat 30-50   (新疆/西藏/青海/甘肃/宁夏/内蒙)
  sw  西南  lon 97-110   lat 21-34   (四川/云南/贵州/西藏/重庆)
  ne  东北  lon 118-135  lat 38-54   (黑龙江/吉林/辽宁/内蒙东)
  se  东南  lon 110-125  lat 21-35   (江浙沪皖闽赣湘粤桂琼台港澳)
  c   中原  lon 104-122  lat 31-43   (陕豫晋鄂鲁冀京津)

用法：python scripts/regenerate-map-regions.py
"""
import json
import os
import re

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(REPO, 'source', 'data', 'china-provinces.json')
DST = os.path.join(REPO, 'source', 'data', 'china-regions.js')

W, H = 900, 720

REGIONS = [
    {'id': 'nw', 'name': '西北', 'desc': '长河落日·驼铃霜雪', 'accent': '#A8443C',
     'lonMin': 73, 'lonMax': 108, 'latMin': 30, 'latMax': 50,
     'provinces': ['新疆维吾尔自治区', '西藏自治区', '青海省', '甘肃省', '宁夏回族自治区', '内蒙古自治区']},
    {'id': 'sw', 'name': '西南', 'desc': '蜀道青天·雪峰列屏', 'accent': '#A8443C',
     'lonMin': 97, 'lonMax': 110, 'latMin': 21, 'latMax': 34,
     'provinces': ['四川省', '云南省', '贵州省', '重庆市']},
    {'id': 'ne', 'name': '东北', 'desc': '白山黑水·人参鹿影', 'accent': '#A8443C',
     'lonMin': 118, 'lonMax': 135, 'latMin': 38, 'latMax': 54,
     'provinces': ['黑龙江省', '吉林省', '辽宁省', '内蒙古自治区']},
    {'id': 'se', 'name': '东南', 'desc': '烟雨江南·六朝金粉', 'accent': '#A8443C',
     'lonMin': 110, 'lonMax': 125, 'latMin': 21, 'latMax': 35,
     'provinces': ['浙江省', '江苏省', '上海市', '安徽省', '福建省', '江西省',
                   '湖南省', '广东省', '广西壮族自治区', '海南省', '台湾省',
                   '香港特别行政区', '澳门特别行政区']},
    {'id': 'c', 'name': '中原', 'desc': '十三朝古都·半部中国', 'accent': '#A8443C',
     'lonMin': 104, 'lonMax': 122, 'latMin': 31, 'latMax': 43,
     'provinces': ['陕西省', '河南省', '山西省', '湖北省', '山东省', '河北省',
                   '北京市', '天津市']},
]


def project_ring(ring, r):
    """等距矩形投影：返回 fitExtent 到 (W, H) 的 SVG 路径 d 串（已闭合）。"""
    pts = []
    for lo, la in ring:
        x = (lo - r['lonMin']) / (r['lonMax'] - r['lonMin']) * W
        # 纬度翻转（北为上）
        y = (r['latMax'] - la) / (r['latMax'] - r['latMin']) * H
        pts.append(f'{x:.1f},{y:.1f}')
    return 'M' + ' L'.join(pts) + 'Z'


def extract_polygons(geom):
    """返回所有 polygon 环（含外环+洞）。GeoJSON Polygon/MultiPolygon 统一。"""
    if geom['type'] == 'Polygon':
        return geom['coordinates']
    if geom['type'] == 'MultiPolygon':
        out = []
        for poly in geom['coordinates']:
            out.extend(poly)
        return out
    return []


def main():
    data = json.load(open(SRC, encoding='utf-8'))
    by_name = {f['properties']['name']: f for f in data['features']}

    out = {}
    for r in REGIONS:
        # 统一区域视口：所有省和点位都用同一 lon/lat 范围投影到 W×H
        lon_span = r['lonMax'] - r['lonMin']
        lat_span = r['latMax'] - r['latMin']
        scale = min(W / lon_span, H / lat_span)  # 等距矩形
        offset_x = (W - lon_span * scale) / 2
        offset_y = (H - lat_span * scale) / 2
        # 防止部分省域稍微超出区域 lon/lat（容差 1.5°），给 viewBox 留 20px padding
        pad = 20
        vbX = -offset_x - pad
        vbY = -offset_y - pad
        vW = W + 2 * pad
        vH = H + 2 * pad

        def project(lo, la):
            x = (lo - r['lonMin']) * scale + offset_x
            y = (r['latMax'] - la) * scale + offset_y  # 北为上
            return x, y

        feats = []
        for name in r['provinces']:
            f = by_name.get(name)
            if not f: continue
            rings = extract_polygons(f['geometry'])
            # 过滤掉主要 bbox 严重超出区范围的省（如 ne 的内蒙东段 → 仅取属于区域范围的部分）
            kept_rings = []
            for ring in rings:
                in_count = sum(1 for lo, la in ring
                               if r['lonMin'] - 1.5 <= lo <= r['lonMax'] + 1.5
                               and r['latMin'] - 1.5 <= la <= r['latMax'] + 1.5)
                if in_count >= len(ring) * 0.05:  # 至少 5% 的点在区内
                    kept_rings.append(ring)
            if not kept_rings:
                continue
            paths = []
            for ring in kept_rings:
                pts = []
                for lo, la in ring:
                    x, y = project(lo, la)
                    pts.append(f'{x:.1f},{y:.1f}')
                paths.append('M' + ' L'.join(pts) + 'Z')
            # 中心
            n = sum(len(rg) for rg in kept_rings)
            cx = sum(project(lo, la)[0] for rg in kept_rings for lo, la in rg) / n
            cy = sum(project(lo, la)[1] for rg in kept_rings for lo, la in rg) / n
            feats.append({'name': name, 'paths': paths, 'cx': cx, 'cy': cy})

        if not feats:
            continue
        # 视口按实际内容 bbox 自动扩（含溢出）+ padding
        all_x, all_y = [], []
        for f in feats:
            for d in f['paths']:
                nums = list(map(float, re.findall(r'-?\d+\.?\d*', d)))
                all_x.extend(nums[0::2]); all_y.extend(nums[1::2])
        vbx = min(all_x) - 30
        vby = min(all_y) - 30
        vw = max(all_x) - vbx + 30
        vh = max(all_y) - vby + 30
        out[r['id']] = {
            'meta': {k: r[k] for k in ('id', 'name', 'desc', 'accent', 'lonMin', 'lonMax', 'latMin', 'latMax')}
                  | {'w': round(vw), 'h': round(vh), 'vbX': round(vbx), 'vbY': round(vby)},
            'features': feats,
        }

    # 校验：每个区域都不能出现 y 全聚 < 50px 宽的情况
    for rid, body in out.items():
        ys = []
        for f in body['features']:
            for d in f['paths']:
                for n in re.findall(r'\d+\.?\d*', d.split('M')[1] if 'M' in d else d):
                    pass
        # 实际从 paths 算 y 范围
        ys = []
        for f in body['features']:
            for d in f['paths']:
                nums = list(map(float, re.findall(r'-?\d+\.?\d*', d)))
                ys.extend(nums[1::2])  # 每对的第二个是 y
        if ys:
            ymin, ymax = min(ys), max(ys)
            print(f'  {rid} {body["meta"]["name"]:4s}  {len(body["features"])} 省  y∈[{ymin:.0f},{ymax:.0f}]  spread={ymax - ymin:.0f}px')
            if ymax - ymin < 50:
                print(f'    ⚠️  y 范围过窄，可能仍有问题')

    header = '// 5 大地理文化区块（西北/西南/东北/东南/中原）\n' \
             '// 等距矩形投影，源 china-provinces.json，由 scripts/regenerate-map-regions.py 生成\n' \
             'window.CHINA_REGIONS = '
    with open(DST, 'w', encoding='utf-8') as f:
        f.write(header + json.dumps(out, ensure_ascii=False) + ';\n')
    print(f'\n写入 {DST}  ({os.path.getsize(DST)/1024:.1f} KB)')


if __name__ == '__main__':
    main()
