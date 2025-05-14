const { test } = require('@playwright/test');
const { performance } = require('perf_hooks');

let testData = [
  {
    SKU: 'DD1391 103',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-grey-fog-dd1391-103-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DD1391 100',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-retro-white-black-panda-dd1391-100-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'CW2288 111',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-air-force-1-07-triple-white-2021-cw2288-111-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'B75806',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-cloud-white-core-black-b75806-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DD1503 101',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-white-black-panda-w-dd1503-101-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DD1503 124',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-cacao-wow-w-dd1503-124-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DC0774 105',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'jordan-1-low-wolf-grey-w-dc0774-105-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DD8959 100',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-air-force-1-07-triple-white-w-dd8959-100-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'MR530SH',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-530-ivory-mr530sh-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DZ5485 612',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'jordan-1-retro-high-og-lost-and-found-dz5485-612-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'MR530SG',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-530-white-silver-navy-mr530sg-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'VN000D3HY28',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'vans-old-skool-black-white-vn000d3hy28-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DC0774 101',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'jordan-1-low-panda-2023-w-dc0774-101-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'MR530KA',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-530-steel-grey-mr530ka-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DD1391 400',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-valerian-blue-dd1391-400-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '398846 02',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'puma-speedcat-og-red-white-398846-02-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DD1391 101',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-team-green-dd1391-101-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '1201A019 200',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'asics-gel-kayano-14-birch-dark-pewter-1201a019-200-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'FQ1180 001',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-sb-dunk-low-yuto-horigome-fq1180-001-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '553558 053',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'jordan-1-low-vintage-grey-553558-053-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'CZ0790 106',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'jordan-1-retro-low-og-black-toe-cz0790-106-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'FZ3653 104',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-zoom-vomero-5-light-orewood-brown-fz3653-104-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'ML2002R0',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-2002r-grey-ml2002r0-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'HQ6448',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'yeezy-slide-onyx-hq6448-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DD1503 103',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-photon-dust-w-dd1503-103-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'BV1358 003',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-zoom-vomero-5-triple-black-2023-bv1358-003-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'BD7633',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-handball-spezial-navy-gum-bd7633-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'HQ4540',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'yeezy-boost-350-v2-onyx-hq4540-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'BB550WT1',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-550-white-green-bb550wt1-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DB3021',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-handball-spezial-black-gum-db3021-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DH2987 101',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-court-vision-low-next-nature-white-black-dh2987-101-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'FV5029 006',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'air-jordan-4-retro-bred-reimagined-fv5029-006-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DZ4137 700',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'air-jordan-1-retro-low-og-sp-travis-scott-canary-w-dz4137-700-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'ML2002RA',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-2002r-light-grey-ml2002ra-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'BB550WTG',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-550-white-gray-bb550wtg-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'FQ8732 010',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-p-6000-black-anthracite-fq8732-010-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'IH7756',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-nylon-wales-bonner-wonder-clay-royal-ih7756-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '1201A019 108',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'asics-gel-kayano-14-cream-black-metallic-plum-1201a019-108-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'M1906RA',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-1906r-white-gold-m1906ra-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '553558 052',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'jordan-1-low-shadow-toe-553558-052-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'CZ0790 003',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'air-jordan-1-low-og-shadow-2024-cz0790-003-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DD1503 118',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-rose-whisper-w-dd1503-118-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'FJ4188 100',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-se-light-carbon-fj4188-100-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '162050C',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'converse-chuck-taylor-all-star-70s-high-black-162050c-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'IE0877',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-white-halo-blue-gum-w-ie0877-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '555088 105',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'jordan-1-retro-high-dark-mocha-555088-105-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'HF4308 072',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-p-6000-light-bone-white-metallic-hf4308-072-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'FV5029 141',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'air-jordan-4-retro-military-blue-2024-fv5029-141-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '553558 141',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'air-jordan-1-low-midnight-navy-553558-141-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'BD7632',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-handball-spezial-light-blue-bd7632-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'CN0149 001',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-p-6000-metallic-silver-sail-cn0149-001-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '162058C',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'converse-chuck-taylor-all-star-70s-ox-black-white-162058c-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'IE3402',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-handball-spezial-core-black-leather-ie3402-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'M1906RHA',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-1906r-brighton-grey-m1906rha-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'ID2055',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-core-white-blue-gum-id2055-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '553558 161',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'air-jordan-1-low-bred-toe-20-553558-161-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '315122 001 / CW2288 001',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-air-force-1-low-07-triple-black-315122-001-cw2288-001-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DC0774 001',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'air-jordan-1-low-jade-smoke-w-dc0774-001-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'HF4292 200',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-next-nature-baroque-brown-hf4292-200-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 410866,
    baseurl: 'kickavenue.com/a/b/',
    slug: 'salomon-xt-6-black-phantom-410866-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'BQ6806 100 2021',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-blazer-mid-77-vintage-white-black-2021-bq6806-100-2021-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'FZ5042 041',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'air-jordan-1-low-se-phantom-denim-swoosh-fz5042-041-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '1201A019 005',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'asics-gel-kayano-14-seal-grey-1201a019-005-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '398846 01',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'puma-speedcat-og-black-white-398846-01-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'BB550WWW',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-550-triple-white-bb550www-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'VN0009QC6BT',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'vans-vault-knu-skool-black-white-vn0009qc6bt-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'MR530AD',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-530-white-silver-metallic-mr530ad-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'IE3677',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-cloud-white-core-black-ps-ie3677-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 61.99025,
    baseurl: 'kickavenue.com/a/b/',
    slug: 'on-running-cloudmonster-all-black-6199025-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'IE0872',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-collegiate-green-w-ie0872-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DH2920 111',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-air-force-1-le-triple-white-gs-dh2920-111-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DV0834 101',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-industrial-blue-sashiko-dv0834-101-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'MR530TA',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-530-silver-cream-mr530ta-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'IG6195',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-bali-tactile-steel-dark-marine-ig6195-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '554724 092',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'jordan-1-mid-light-smoke-grey-554724-092-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'ID0478',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-cream-white-sand-strata-w-id0478-ka-2',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '396464 01',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'puma-palermo-leather-white-vapor-grey-gum-396464-01-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'BB550STA',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-550-vintage-teal-bb550sta-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'HF1068 133',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-court-vision-low-sail-gum-light-brown-hf1068-133-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'IH2751',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-cloud-white-wonder-quartz-w-ih2751-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'CP9652',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'yeezy-boost-350-v2-bred-blackred-cp9652-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'IE3675',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-cloud-white-core-black-gs-ie3675-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'DD1503 125',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-diffused-taupe-w-dd1503-125-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'HQ8708',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-campus-00s-core-black-hq8708-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'B75807 / BZ0058',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-black-white-gum-b75807-bz0058-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '396463 11',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'puma-palermo-alpine-snow-396463-11-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'MR530EMA',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-530-white-silver-mr530ema-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'IF7087',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-handball-spezial-night-indigo-if7087-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'ID1447',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-cream-white-id1447-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'KP DD1391 100',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'nike-dunk-low-retro-white-black-panda-kick-point-only-kp-dd1391-100-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '396524 01',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'puma-suede-one-piece-whitebeard-396524-01-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'PM 88715241PCS',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'pop-mart-crybaby-x-powerpuff-girls-series-vinyl-face-plush-blind-box-pm-8871524-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: '1183B938 100',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'onitsuka-tiger-tokuten-white-black-gold-1183b938-100-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'PM FGCPMTMTMVFBBWS00PT1PCS',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'pop-mart-labubu-the-monsters-tasty-macarons-vinyl-face-blind-box-pm-fgcps00pt-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'IG1962',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'adidas-samba-og-lucid-pink-w-ig1962-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'M1906RFA',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'new-balance-1906-white-navy-silver-m1906rfa-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'PM LBBLAZYYOGAFG01',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'pop-mart-labubu-the-monsters-lazy-yoga-series-figures-pm-lbblazyyogafg01-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'SAS65911P',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'sonny-angel-figurine-hippers-looking-back-series-blind-box-sas65911p-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'PM TMPLSHBNBX1PCS',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'pop-mart-labubu-the-monster-have-a-seat-vinyl-plush-blind-box-pm-tmplshbnbx-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  },
  {
    SKU: 'PM FGCPMTMTMVFBBWS00PTSET',
    baseurl: 'kickavenue.com/a/b/',
    slug: 'pop-mart-labubu-the-monsters-tasty-macarons-vinyl-face-blind-box-set-pm-fgcpmtmtmvfbbws00ptset-ka',
    productUrl: '',
    loading_speed_1: '',
    loading_speed_2: '',
    loading_speed_3: '',
    'Average Loading Speed': ''
  }
];

test.describe('Page Load Time', () => {
  for (let i = 0; i < 3; i++) {
    test(`Test for Page Load Time ${i}`, async ({ page, request }) => {
      for (let index = 0; index < testData.length; index++) {
        const response = await request.get(
          'https://api.kickavenue.com/admins/stock',
          {
            headers: {
              Authorization: `Bearer ${'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vYXBpLmtpY2thdmVudWUuY29tL2F1dGgiLCJpYXQiOjE3MjgwMDk3NDIsImV4cCI6MTcyODA5NjE0MiwibmJmIjoxNzI4MDA5NzQyLCJqdGkiOiJlZGtBcU00SnFQenZvVnl3Iiwic3ViIjo4NjQ5MjMsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjciLCJlbWFpbCI6Im5hdWZhbGhpbG1pQGtpY2thdmVudWUuY29tIiwicm9sZXMiOiJhZG1pbmlzdHJhdG9yLGludGVybmFsLHNlbGxlcixzZWxsZXJfYXBwYXJlbCxzZWxsZXJfaGFuZGJhZyxzZWxsZXJfbGlmZXN0eWxlLHRydXN0ZWRfc2VsbGVyLHVzZXIiLCJwZXJtaXNzaW9ucyI6IiIsInR5cGVkX2VtYWlsIjoibmF1ZmFsaGlsbWlAa2lja2F2ZW51ZS5jb20ifQ.kv3JJ9Y4OHCsVhQ01W02YPaajWqeS7SeLRQj6pUzsWk'}`
            },
            params: {
              keyword: testData[index].SKU
            }
          }
        );
        const bodyResponse = await response.json();
        const product = bodyResponse.data.data[0];
        const productUrl = `https://www.kickavenue.com/${product.product.category.name}/${product.product.brand.slug}/${product.slug}/${product.id}/`;
        await page.goto(productUrl);
        const start = performance.now();
        await page
          .getByRole('img', { name: 'https://kickavenue-assets.s3.' })
          .waitFor({ state: 'visible' });
        const end = performance.now();
        const durationSeconds = (end - start) / 1000;
        let loadingSpeed = `loading_speed_${i + 1}`;
        if (i === 0) {
          testData[index].productUrl = productUrl;
        }
        testData[index][loadingSpeed] = durationSeconds;
        if (i === 2) {
          console.log(JSON.stringify(testData));
        }
      }
    });
  }
});
