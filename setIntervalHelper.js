function setIntervalHelper(callback, delay)
{
	// Текущий объект
	var that = this,
		// Время старта интервала
		startTime = Date.now(),
		// Идентификатор интервала
		timerId,
		// Время запуска паузы
		pauseStart,
		// Время окончания паузы
		pauseStop,
		// Время перезапуска таймера
		restart,
		// Общее время работы интервала
		unit,
		// Статусы состояния
		status = {
			pause: false,
			resume: false,
			start: false
		};
	// Функция остановки интервала
	that.stop = function(func)
	{
		// Если статусы запуска и перезапуска false
		if(!status.start && !status.resume)
		{
			return false;
		}
		// Если старт true
		if(status.start)
		{
			// Устанавливаем статус в false
			status.start = false;
			// Останавливаем интервал
			window.clearInterval(timerId);
		}
		// Если пауза true
		if(status.resume)
		{
			// Устанавливаем статус в false
			status.resume = false;
			// Останавливаем таймер
			window.clearTimeout(timerId);
		}
		// Если была передана функция
		if(typeof func === 'function')
		{
			// Вызаваем функцию
			func.call();
		}
		return true;
	};
	// Функция паузы интервала
	that.pause = function(func)
	{
		// Если старт false
		if(!status.start)
		{
			return false;
		}
		// Устанавливаем статус в true
		status.pause = true;
		// Время запуска паузы
		pauseStart = Date.now();
		// Останавливаем интервал
		that.stop();
		// Если была передана функция
		if(typeof func === 'function')
		{
			// Вызаваем функцию
			func.call();
		}
		return true;
	};
	// Функция восстановления интервала
	that.resume = function(func)
	{
		// Если пауза false
		if(!status.pause)
		{
			return false;
		}
		// Устанавливаем статус паузы в false
		status.pause = false;
		// Устанавливаем статус перезапуска в true
		status.resume = true;
		// Время возобновления интервала
		pauseStop = Date.now();
		// Вычисляем время паузы
		// И добавляем его ко времени старта
		startTime += pauseStop - pauseStart;
		// Вычисляем сколько времени работает интервал
		unit = pauseStop - startTime;
		// Сначала сколько полных циклов уже было пройдено
		// Потом получаем время всех циклов
		// И вычисляем сколько осталось пройти до следующего цикла
		restart = unit - (parseInt(unit / delay) * delay);
		// Запускаем таймер до следующего цикла
		timerId = window.setTimeout(function(){
			// Вызываем функцию цикла
			callback.call();
			// Перезапускаем интервал
			startFunc();
		}, restart);
		// Если была передана функция
		if(typeof func === 'function')
		{
			// Вызаваем функцию
			func.call();
		}
		return true;
	};
	// Перезапуск интервала
	that.reset = function(func)
	{
		// Если статусы запуска и перезапуска false
		if(!status.start && !status.resume)
		{
			return false;
		}
		// Останавливаем интервал
		that.stop();
		// Перезапускаем интервал
		startFunc();
		// Если была передана функция
		if(typeof func === 'function')
		{
			// Вызаваем функцию
			func.call();
		}
	}
	// Функция старта интервала
	var startFunc = function()
	{
		// Статус старта таймера
		status.start = true;
		// Время запуска таймера
		startTime = Date.now();
		// Запуск таймера
		timerId = window.setInterval(callback, delay);
	};
	// Запускаем таймер
	startFunc();
	// Возвращаем объект
	return that;
}
