const fs = require('fs');
const data = JSON.parse(fs.readFileSync('source/data/china-provinces.json', 'utf8'));
// 5 大区域 → 各自应含省份
const targets = {
  nw: ['新疆维吾尔自治区','西藏自治区','青海省','甘肃省','宁夏回族自治区','内蒙古自治区'],
  sw: ['四川省','云南省','贵州省','西藏自治区','重庆市'],
  ne: ['黑龙江省','吉林省','辽宁省','内蒙古自治区'],
  se: ['浙江省','江苏省','上海市','安徽省','福建省','江西省','湖南省','广东省','广西壮族自治区','海南省','台湾省','香港特别行政区','澳门特别行政区'],
  c:  ['陕西省','河南省','山西省','湖北省','山东省','河北省','北京市','天津市']
};
// 实际上 SE 范围太大导致部分省到外框，让数据/省范围保持 SE 东南框但允许其他区域重叠
// 修正：给每个区域一个画布
// 直接基于 data.features 计算每个区内的省（用其 centroid 在区域内）
const regions = [
  { id:'nw', name:'西北', lonMin:73,  lonMax:108, latMin:30, latMax:50, w:900, h:720 },
  { id:'sw', name:'西南', lonMin:97,  lonMax:106, latMin:21, latMax:34, w:900, h:720 },
  { id:'ne', name:'东北', lonMin:118, lonMax:135, latMin:38, latMax:54, w:900, h:720 },
  { id:'se', name:'东南', lonMin:113, lonMax:125, latMin:22, latMax:33, w:900, h:720 },
  { id:'c',  name:'中原', lonMin:104, lonMax:118, latMin:31, latMax:40, w:900, h:720 }
];
const CHINA_REGIONS = {};
regions.forEach(r => {
  CHINA_REGIONS[r.id] = { meta: { ...r, accent: '#6E8A6F' }, features: [] };
  data.features.forEach(f => {
    const c = f.properties.centroid || (f.properties.center || [103,35]);
    if (c[0] < r.lonMin - 1.5 || c[0] > r.lonMax + 1.5 || c[1] < r.latMin - 1.5 || c[1] > r.latMax + 1.5) return;
    const paths = [];
    function take(g) {
      if (g.type === 'Polygon') g.coordinates.forEach(r2 => paths.push('M' + r2.map(([lo,la]) => {
        const x = (lo - r.lonMin) / (r.lonMax - r.lonMin) * r.w;
        const phi = la * Math.PI / 180;
        const phiMin = r.latMin * Math.PI / 180, phiMax = r.latMax * Math.PI / 180;
        const yMerc = Math.log(Math.tan(Math.PI/4 + phi/2));
        const yMin = Math.log(Math.tan(Math.PI/4 + phiMin/2));
        const yMax = Math.log(Math.tan(Math.PI/4 + phiMax/2));
        const y = (yMax - yMerc) / (yMax - yMin) * r.h;
        return x.toFixed(1) + ',' + y.toFixed(1);
      }).join(' L') + 'Z'));
      else if (g.type === 'MultiPolygon') g.coordinates.forEach(p => p.forEach(r2 => take({type:'Polygon',coordinates:[r2]}))));
    }
    take(f.geometry);
    if (paths.length) {
      const phi = c[1] * Math.PI / 180;
      const phiMin = r.latMin * Math.PI / 180, phiMax = r.latMax * Math.PI / 180;
      const yMerc = Math.log(Math.tan(Math.PI/4 + phi/2));
      const yMin = Math.log(Math.tan(Math.PI/4 + phiMin/2));
      const yMax = Math.log(Math.tan(Math.PI/4 + phiMax/2));
      const cx = (c[0] - r.lonMin) / (r.lonMax - r.lonMin) * r.w;
      const cy = (yMax - yMerc) / (yMax - yMin) * r.h;
      CHINA_REGIONS[r.id].features.push({ name: f.properties.name, paths, cx, cy });
    }
  });
});
fs.writeFileSync('source/data/china-regions.js',
  '// 5 大地理文化区块（西北/西南/东北/东南/中原）— 升级到与东北同标准\n' +
  'window.CHINA_REGIONS = ' + JSON.stringify(CHINA_REGIONS) + ';\n', 'utf8');
console.log('写入 source/data/china-regions.js:', fs.statSync('source/data/china-regions.js').size + ' bytes');
Object.keys(CHINA_REGIONS).forEach(k => {
  const r = CHINA_REGIONS[k].meta;
  const c = CHINA_REGIONS[k].features;
  console.log('  - ' + r.name + ' [' + r.lonMin + '-' + r.lonMax + 'E, ' + r.latMin + '-' + r.latMax + 'N]: ' + c.length + ' 省');
});
