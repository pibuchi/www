<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>상권분석 대시보드</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.datatables.net/1.13.4/css/dataTables.bootstrap5.min.css" rel="stylesheet">
  <link href="css/style.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
<div class="d-flex" id="wrapper">
  <!-- Sidebar -->
  <div class="bg-dark border-end text-white p-3" id="sidebar-wrapper">
    <h4 class="text-white">📊 상권 데이터</h4>
    <div class="list-group list-group-flush mt-3">
      <button class="list-group-item list-group-item-action bg-dark text-white" onclick="loadModule('item')">아이템정보</button>
      <button class="list-group-item list-group-item-action bg-dark text-white" onclick="loadModule('resident')">거주인구</button>
      <button class="list-group-item list-group-item-action bg-dark text-white" onclick="loadModule('floating')">이동인구</button>
      <button class="list-group-item list-group-item-action bg-dark text-white" onclick="loadModule('store')">소분류별 점포수</button>
      <button class="list-group-item list-group-item-action bg-dark text-white" onclick="loadModule('total')">전체 상권정보</button>
      <button class="list-group-item list-group-item-action bg-dark text-white" onclick="loadModule('template')">초기템플릿</button>
    </div>
  </div>

  <!-- Page content -->
  <div class="container-fluid p-4" id="main-content">
    <h3 class="mb-4">상권 분석 데이터 시각화</h3>
    <div id="chart-area">
      <canvas id="mainChart" height="120"></canvas>
    </div>
    <div id="table-area" class="mt-5">
      <table id="data-table" class="table table-striped" style="width:100%">
        <thead></thead>
        <tbody></tbody>
      </table>
    </div>
  </div>
</div>

<script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
<script src="https://cdn.datatables.net/1.13.4/js/jquery.dataTables.min.js"></script>
<script src="https://cdn.datatables.net/1.13.4/js/dataTables.bootstrap5.min.js"></script>

<script>
function loadModule(moduleName) {
  $('#mainChart').hide();
  $('#table-area').hide();

  fetch(`data/${moduleName}.json`)
    .then(res => res.json())
    .then(data => {
      renderTable(data);
      $('#table-area').show();
    })
    .catch(() => {
      alert("데이터를 불러올 수 없습니다.");
    });
}

function renderTable(data) {
  let table = $('#data-table');
  table.DataTable().destroy();
  let headers = Object.keys(data[0]);

  let thead = '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
  let tbody = data.map(row => {
    return '<tr>' + headers.map(h => `<td>${row[h]}</td>`).join('') + '</tr>';
  }).join('');

  table.find('thead').html(thead);
  table.find('tbody').html(tbody);
  table.DataTable({ pageLength: 10 });
}
</script>
</body>
</html>
