import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { DataTable } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../style/theme';
import DatePicker from 'react-native-date-picker';

const SalesReports = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState({});
  const [timeRange, setTimeRange] = useState('week');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState('start');

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    generateStaticData();
  }, [timeRange, startDate, endDate]);

  const groupDataByTimeRange = (data, range) => {
    if (range === 'day' || range === 'week') {
      return data;
    }

    const groupedData = [];
    let currentGroup = [];
    let currentPeriod = '';

    data.forEach((item, index) => {
      const date = new Date(item.date);
      let period;
      
      if (range === 'month') {
        period = `${date.getFullYear()}-${date.getMonth()}`;
      } else { // year
        period = `${date.getFullYear()}-${Math.floor(date.getMonth() / 3)}`; // Group by quarter
      }

      if (period !== currentPeriod) {
        if (currentGroup.length > 0) {
          const sum = currentGroup.reduce((acc, curr) => acc + curr.total_sales, 0);
          const avg = sum / currentGroup.length;
          groupedData.push({
            date: currentGroup[0].date,
            total_sales: Math.floor(avg)
          });
        }
        currentGroup = [item];
        currentPeriod = period;
      } else {
        currentGroup.push(item);
      }

      // Add the last group
      if (index === data.length - 1 && currentGroup.length > 0) {
        const sum = currentGroup.reduce((acc, curr) => acc + curr.total_sales, 0);
        const avg = sum / currentGroup.length;
        groupedData.push({
          date: currentGroup[0].date,
          total_sales: Math.floor(avg)
        });
      }
    });

    return groupedData;
  };

  const generateStaticData = () => {
    const daysInRange = timeRange === 'day' ? 1 : 
                       timeRange === 'week' ? 7 : 
                       timeRange === 'month' ? 30 : 365;
    
    const dailySales = [];
    for (let i = daysInRange; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dailySales.push({
        date: date.toISOString().split('T')[0],
        total_sales: Math.floor(Math.random() * 10000) + 1000
      });
    }

    // data based on time ranfe
    const processedSales = groupDataByTimeRange(dailySales, timeRange);

    const topProducts = [
      { name: 'Hablon Wallet', total_sales: Math.floor(Math.random() * 100) + 1000 },
      { name: 'Cashew Nuts', total_sales: Math.floor(Math.random() * 500) + 1000 },
      { name: 'Barako Coffee', total_sales: Math.floor(Math.random() * 500) + 1000 },
      { name: 'Piaya Original', total_sales: Math.floor(Math.random() * 500) + 1000 },
      { name: 'Pinasugbo', total_sales: Math.floor(Math.random() * 500) + 1000 }
    ];

    const salesByCategory = [
      { category: 'Pasalubong', total_sales: Math.floor(Math.random() * 100) + 1000 },
      { category: 'Handcraft', total_sales: Math.floor(Math.random() * 100) + 1000 },
      { category: 'Foods', total_sales: Math.floor(Math.random() * 100) + 1000 },
      { category: 'Local Goods', total_sales: Math.floor(Math.random() * 100) + 1000 }
    ];

    const recentTransactions = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 7));
      recentTransactions.push({
        order_id: `ORD${Math.floor(1000 + Math.random() * 9000)}`,
        date: date.toISOString(),
        amount: Math.floor(Math.random() * 5000) + 500
      });
    }

    const totalSales = dailySales.reduce((sum, day) => sum + day.total_sales, 0);
    const totalOrders = Math.floor(totalSales / 1000);
    const averageOrder = Math.floor(totalSales / totalOrders);

    setSalesData({
      daily_sales: processedSales,
      top_products: topProducts,
      sales_by_category: salesByCategory,
      recent_transactions: recentTransactions,
      summary: {
        total_sales: totalSales,
        total_orders: totalOrders,
        average_order: averageOrder
      }
    });
  };

  const handleDateConfirm = (date) => {
    if (pickerMode === 'start') {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
    setDatePickerOpen(false);
    generateStaticData();
  };

  const chartConfig = {
    backgroundColor: '#fff',
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#007aff'
    }
  };

  const renderTimeRangeButtons = () => {
    const ranges = [
      { label: 'Day', value: 'day' },
      { label: 'Week', value: 'week' },
      { label: 'Month', value: 'month' },
      { label: 'Year', value: 'year' },
      { label: 'Custom', value: 'custom' }
    ];

    return (
      <View style={styles.rangeContainer}>
        {ranges.map((range) => (
          <TouchableOpacity
            key={range.value}
            style={[
              styles.rangeButton,
              timeRange === range.value && styles.activeRangeButton
            ]}
            onPress={() => setTimeRange(range.value)}
          >
            <Text
              style={[
                styles.rangeButtonText,
                timeRange === range.value && styles.activeRangeButtonText
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderDateSelectors = () => {
    if (timeRange !== 'custom') return null;

    return (
      <View style={styles.dateSelectorContainer}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setPickerMode('start');
            setDatePickerOpen(true);
          }}
        >
          <Text style={styles.dateButtonText}>
            {startDate.toLocaleDateString()}
          </Text>
          <Ionicons name="calendar" size={20} color={COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.dateToText}>to</Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => {
            setPickerMode('end');
            setDatePickerOpen(true);
          }}
        >
          <Text style={styles.dateButtonText}>
            {endDate.toLocaleDateString()}
          </Text>
          <Ionicons name="calendar" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderSalesChart = () => {
    if (!salesData.daily_sales) return null;

    const minWidth = screenWidth - 40;
    const pointWidth = 60; 
    const chartWidth = Math.max(minWidth, salesData.daily_sales.length * pointWidth);

    const labels = salesData.daily_sales.map(item => {
      const date = new Date(item.date);
      if (timeRange === 'month') {
        return `${date.getMonth() + 1}/${date.getDate()}`;
      } else if (timeRange === 'year') {
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        return `Q${quarter} ${date.getFullYear()}`;
      }
      return date.getDate().toString();
    });

    const data = salesData.daily_sales.map(item => item.total_sales);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {timeRange === 'year' ? 'Quarterly Sales Trend' : 
           timeRange === 'month' ? 'Weekly Sales Trend' : 'Daily Sales Trend'}
        </Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.chartScrollContainer}
        >
          <LineChart
            data={{
              labels,
              datasets: [
                {
                  data,
                  color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                  strokeWidth: 2
                }
              ]
            }}
            width={chartWidth}
            height={220}
            chartConfig={{
              ...chartConfig,
              propsForLabels: {
                fontSize: timeRange === 'year' ? 10 : 12
              }
            }}
            bezier
            style={styles.chart}
            fromZero
            withHorizontalLabels={salesData.daily_sales.length < 15}
            segments={timeRange === 'year' ? 4 : 5}
          />
        </ScrollView>
      </View>
    );
  };

  const renderTopProductsChart = () => {
    if (!salesData.top_products || salesData.top_products.length === 0) return null;

    const data = salesData.top_products.map(product => ({
      name: product.name.length > 12 ? product.name.substring(0, 10) + '...' : product.name,
      sales: product.total_sales,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
      legendFontColor: '#7F7F7F',
      legendFontSize: 12
    }));

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Top Selling Products</Text>
        <PieChart
          data={data}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          accessor="sales"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
          style={styles.chart}
        />
      </View>
    );
  };

  const renderSalesByCategory = () => {
    if (!salesData.sales_by_category || salesData.sales_by_category.length === 0) return null;

    const labels = salesData.sales_by_category.map(item => item.category);
    const data = salesData.sales_by_category.map(item => item.total_sales);

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sales by Category</Text>
        <BarChart
          data={{
            labels,
            datasets: [
              {
                data
              }
            ]
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          verticalLabelRotation={30}
          style={styles.chart}
        />
      </View>
    );
  };

  const renderRecentTransactions = () => {
    if (!salesData.recent_transactions || salesData.recent_transactions.length === 0) return null;

    return (
      <View style={styles.tableContainer}>
        <Text style={styles.chartTitle}>Recent Transactions</Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Order ID</DataTable.Title>
            <DataTable.Title numeric>Date</DataTable.Title>
            <DataTable.Title numeric>Amount</DataTable.Title>
          </DataTable.Header>

          {salesData.recent_transactions.map((transaction) => (
            <DataTable.Row key={transaction.order_id}>
              <DataTable.Cell>{transaction.order_id}</DataTable.Cell>
              <DataTable.Cell numeric>
                {new Date(transaction.date).toLocaleDateString()}
              </DataTable.Cell>
              <DataTable.Cell numeric>₱{transaction.amount.toLocaleString()}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </View>
    );
  };

  const renderSummaryCards = () => {
    if (!salesData.summary) return null;

    return (
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Sales</Text>
          <Text style={styles.summaryValue}>₱{salesData.summary.total_sales.toLocaleString()}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Orders</Text>
          <Text style={styles.summaryValue}>{salesData.summary.total_orders.toLocaleString()}</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Avg. Order</Text>
          <Text style={styles.summaryValue}>₱{salesData.summary.average_order.toLocaleString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sales Reports</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>

        {renderTimeRangeButtons()}
        {renderDateSelectors()}

        <View style={styles.content}>
          {renderSummaryCards()}
          {renderSalesChart()}
          {renderTopProductsChart()}
          {renderSalesByCategory()}
          {renderRecentTransactions()}
        </View>

        <DatePicker
          modal
          open={datePickerOpen}
          date={pickerMode === 'start' ? startDate : endDate}
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerOpen(false)}
          mode="date"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
  },
  backButtonPlaceholder: {
    width: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1,
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingHorizontal: 16,
  },
  rangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeRangeButton: {
    backgroundColor: COLORS.primary,
  },
  rangeButtonText: {
    color: '#666',
    fontSize: 14,
  },
  activeRangeButtonText: {
    color: '#fff',
  },
  dateSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  dateButtonText: {
    marginRight: 5,
    color: '#333',
  },
  dateToText: {
    marginHorizontal: 5,
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chartContainer: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartScrollContainer: {
    paddingRight: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  chart: {
    borderRadius: 10,
  },
  tableContainer: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default SalesReports;