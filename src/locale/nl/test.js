// @flow
/* eslint-env mocha */

import assert from 'power-assert'
import locale from '.'

import format from '../../format'
import formatDistance from '../../formatDistance'
import formatDistanceStrict from '../../formatDistanceStrict'
import formatRelative from '../../formatRelative'
import parse from '../../parse'

describe('nl locale', function () {
  context('with `format`', function () {
    var date = new Date(1986, 3 /* Apr */, 5, 10, 32, 0, 900)

    it('era', function () {
      var result = format(date, 'G, GGGG, GGGGG', {locale: locale})
      assert(result === 'n.Chr., na Christus, n.C.')
    })

    describe('year', function () {
      it('ordinal regular year', function () {
        var result = format(date, "yo 'jaar'", {locale: locale})
        assert(result === '1986e jaar')
      })

      it('ordinal local week-numbering year', function () {
        var result = format(date, "Yo 'week-numbering year'", {locale: locale})
        assert(result === '1986e week-numbering year')
      })
    })

    describe('quarter', function () {
      it('formatting quarter', function () {
        var result = format(date, "Qo 'kwartaal', QQQ, QQQQ, QQQQQ", {locale: locale})
        assert(result === '2e kwartaal, K2, 2e kwartaal, 2')
      })

      it('stand-alone quarter', function () {
        var result = format(date, "qo 'kwartaal', qqq, qqqq, qqqqq", {locale: locale})
        assert(result === '2e kwartaal, K2, 2e kwartaal, 2')
      })
    })

    describe('month', function () {
      it('formatting month', function () {
        var result = format(date, 'd MMMM', {locale: locale})
        assert(result === '5 april')
      })

      it('stand-alone month', function () {
        var result = format(date, "Lo 'maand', LLL, LLLL, LLLLL", {locale: locale})
        assert(result === '4e maand, apr., april, A')
      })
    })

    describe('week', function () {
      it('ordinal local week of year', function () {
        var date = new Date(1986, 3 /* Apr */, 6)
        var result = format(date, "wo 'week'", {locale: locale})
        assert(result === '14e week')
      })

      it('ordinal ISO week of year', function () {
        var date = new Date(1986, 3 /* Apr */, 6)
        var result = format(date, "Io 'week ISO'", {locale: locale})
        assert(result === '14e week ISO')
      })
    })

    describe('day', function () {
      it('ordinal date', function () {
        var result = format(date, "'het is de' do", {locale: locale})
        assert(result === 'het is de 5e')
      })

      it('ordinal day of year', function () {
        var result = format(date, "Do 'dag'", {locale: locale})
        assert(result === '95e dag')
      })
    })

    describe('week day', function () {
      it('day of week', function () {
        var result = format(date, 'E, EEEE, EEEEE, EEEEEE', {locale: locale})
        assert(result === 'zat, zaterdag, Z, za')
      })

      it('ordinal day of week', function () {
        var result = format(date, "eo 'dag van de week'", {locale: locale})
        assert(result === '6e dag van de week')
      })
    })

    describe('day period and hour', function () {
      it('ordinal hour', function () {
        var result = format(date, "ho 'uur'", {locale: locale})
        assert(result === '10e uur')
      })

      it('AM, PM', function () {
        var result = format(date, 'h a, h aaaa, haaaaa', {locale: locale})
        assert(result === '10 AM, 10 AM, 10AM')
      })

      it('AM, PM, noon, midnight', function () {
        var result = format(new Date(1986, 3 /* Apr */, 6, 0), 'b, bbbb, bbbbb', {locale: locale})
        assert(result === 'middernacht, middernacht, middernacht')
      })

      it('flexible day periods', function () {
        it('works as expected', function () {
          var result = format(date, 'h B', {locale: locale})
          assert(result === "10 uur 's ochtends")
        })
      })
    })

    it('ordinal minute', function () {
      var result = format(date, "mo 'minuut'", {locale: locale})
      assert(result === '32e minuut')
    })

    it('ordinal second', function () {
      var result = format(date, "so 'seconde'", {locale: locale})
      assert(result === '0e seconde')
    })

    describe('long format', function () {
      it('short date', function () {
        var result = format(date, 'P', {locale: locale})
        assert(result === '05-04-1986')
      })

      it('medium date', function () {
        var result = format(date, 'PP', {locale: locale})
        assert(result === '5 apr. 1986')
      })

      it('long date', function () {
        var result = format(date, 'PPP', {locale: locale})
        assert(result === '5 april 1986')
      })

      it('full date', function () {
        var result = format(date, 'PPPP', {locale: locale})
        assert(result === 'zaterdag 5 april 1986')
      })

      it('short time', function () {
        var result = format(date, 'p', {locale: locale})
        assert(result === '10:32')
      })

      it('medium time', function () {
        var result = format(date, 'pp', {locale: locale})
        assert(result === '10:32:00')
      })

      it('short date + time', function () {
        var result = format(date, 'Pp', {locale: locale})
        assert(result === '05-04-1986, 10:32')
      })

      it('medium date + time', function () {
        var result = format(date, 'PPpp', {locale: locale})
        assert(result === '5 apr. 1986, 10:32:00')
      })

      it('long date + time', function () {
        var result = format(date, 'PPPp', {locale: locale})
        assert(result === '5 april 1986 om 10:32')
      })

      it('full date + time', function () {
        var result = format(date, 'PPPPp', {locale: locale})
        assert(result === 'zaterdag 5 april 1986 om 10:32')
      })
    })
  })

  context('with `formatDistance`', function () {
    it('works as expected', function () {
      var result = formatDistance(
        new Date(1986, 3, 4, 10, 32, 25),
        new Date(1986, 3, 4, 10, 32, 0),
        {locale: locale, includeSeconds: true}
      )
      assert(result === 'een halve minuut')
    })

    context('when `addSuffix` option is true', function () {
      it('adds a future suffix', function () {
        var result = formatDistance(
          new Date(1986, 3, 4, 10, 32, 7),
          new Date(1986, 3, 4, 10, 32, 0),
          {locale: locale, includeSeconds: true, addSuffix: true}
        )
        assert(result === 'over minder dan 10 seconden')
      })

      it('adds a past suffix', function () {
        var result = formatDistance(
          new Date(1986, 3, 4, 10, 32, 0),
          new Date(1986, 3, 4, 11, 32, 0),
          {locale: locale, addSuffix: true}
        )
        assert(result === 'ongeveer 1 uur geleden')
      })
    })
  })

  context('with `formatDistanceStrict`', function () {
    it('works as expected', function () {
      var result = formatDistanceStrict(
        new Date(1986, 3, 4, 10, 32, 0),
        new Date(1986, 3, 4, 12, 32, 0),
        {locale: locale, unit: 'minute'}
      )
      assert(result === '120 minuten')
    })

    describe('when `addSuffix` option is true', function () {
      it('adds a future suffix', function () {
        var result = formatDistanceStrict(
          new Date(1986, 3, 4, 10, 32, 25),
          new Date(1986, 3, 4, 10, 32, 0),
          {locale: locale, addSuffix: true}
        )
        assert(result === 'over 25 seconden')
      })

      it('adds a past suffix', function () {
        var result = formatDistanceStrict(
          new Date(1986, 3, 4, 10, 32, 0),
          new Date(1986, 3, 4, 11, 32, 0),
          {locale: locale, addSuffix: true}
        )
        assert(result === '1 uur geleden')
      })
    })
  })

  context('with `formatRelative`', function () {
    var baseDate = new Date(1986, 3 /* Apr */, 4, 10, 32, 0, 900)

    it('last week', function () {
      var result = formatRelative(new Date(1986, 3 /* Apr */, 1), baseDate, {locale: locale})
      assert(result === 'afgelopen dinsdag om 00:00')
    })

    it('yesterday', function () {
      var result = formatRelative(new Date(1986, 3 /* Apr */, 3, 22, 22), baseDate, {locale: locale})
      assert(result === 'gisteren om 22:22')
    })

    it('today', function () {
      var result = formatRelative(new Date(1986, 3 /* Apr */, 4, 16, 50), baseDate, {locale: locale})
      assert(result === 'vandaag om 16:50')
    })

    it('tomorrow', function () {
      var result = formatRelative(new Date(1986, 3 /* Apr */, 5, 7, 30), baseDate, {locale: locale})
      assert(result === 'morgen om 07:30')
    })

    it('next week', function () {
      var result = formatRelative(new Date(1986, 3 /* Apr */, 6, 12, 0), baseDate, {locale: locale})
      assert(result === 'zondag om 12:00')
    })

    it('after the next week', function () {
      var result = formatRelative(new Date(1986, 3 /* Apr */, 11, 16, 50), baseDate, {locale: locale})
      assert(result === '11-04-1986')
    })
  })

  context('with `parse`', function () {
    var baseDate = new Date(1986, 3 /* Apr */, 4, 10, 32, 0, 900)

    describe('era', function () {
      it('abbreviated', function () {
        var result = parse('10000 v.Chr.', 'yyyyy G', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(-9999, 0 /* Jan */, 1))
      })

      it('wide', function () {
        var result = parse('2018 na Christus', 'yyyy GGGG', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(2018, 0 /* Jan */, 1))
      })

      it('narrow', function () {
        var result = parse('44 v.C.', 'y GGGGG', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(-43, 0 /* Jan */, 1))
      })
    })

    it('ordinal year', function () {
      var result = parse('2017e', 'yo', baseDate, {locale: locale})
      assert.deepEqual(result, new Date(2017, 0 /* Jan */, 1))
    })

    describe('quarter', function () {
      it('ordinal', function () {
        var result = parse('1e', 'Qo', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 0 /* Jan */, 1))
      })

      it('abbreviated', function () {
        var result = parse('K3', 'QQQ', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 6 /* Jul */, 1))
      })

      it('wide', function () {
        var result = parse('4e kwartaal', 'QQQQ', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 9 /* Oct */, 1))
      })

      it('narrow', function () {
        var result = parse('1', 'QQQQQ', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 0 /* Jan */, 1))
      })
    })

    describe('month', function () {
      it('ordinal', function () {
        var result = parse('6e', 'Mo', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 5 /* Jun */, 1))
      })

      it('abbreviated', function () {
        var result = parse('nov', 'MMM', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 10 /* Nov */, 1))
      })

      it('wide', function () {
        var result = parse('februari', 'MMMM', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 1 /* Feb */, 1))
      })

      it('narrow', function () {
        var result = parse('j', 'MMMMM', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 0 /* Jan */, 1))
      })
    })

    it('ordinal week of year', function () {
      var result = parse('49e', 'wo', baseDate, {locale: locale})
      assert.deepEqual(result, new Date(1986, 11 /* Dec */, 1))
    })

    it('ordinal day of month', function () {
      var result = parse('28e', 'do', baseDate, {locale: locale})
      assert.deepEqual(result, new Date(1986, 3 /* Apr */, 28))
    })

    it('ordinal day of year', function () {
      var result = parse('200e', 'Do', baseDate, {locale: locale})
      assert.deepEqual(result, new Date(1986, 6 /* Jul */, 19))
    })

    describe('day of week', function () {
      it('abbreviated', function () {
        var result = parse('maa', 'E', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 2 /* Mar */, 31))
      })

      it('wide', function () {
        var result = parse('dinsdag', 'EEEE', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 1))
      })

      it('narrow', function () {
        var result = parse('d', 'EEEEE', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 1))
      })

      it('short', function () {
        var result = parse('do', 'EEEEEE', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 3))
      })
    })

    it('ordinal local day of week', function () {
      var result = parse('2e dag van de week', "eo 'dag van de week'", baseDate, {locale: locale})
      assert.deepEqual(result, new Date(1986, 3 /* Apr */, 1))
    })

    describe('AM, PM', function () {
      it('abbreviated', function () {
        var result = parse('5 AM', 'h a', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 4, 5))
      })

      it('wide', function () {
        var result = parse('5 PM', 'h aaaa', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 4, 17))
      })

      it('narrow', function () {
        var result = parse('11 AM', 'h aaaaa', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 4, 11))
      })
    })

    describe('AM, PM, middag, middernacht', function () {
      it('abbreviated', function () {
        var result = parse('het middaguur', 'b', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 4, 12))
      })

      it('wide', function () {
        var result = parse('middernacht', 'bbbb', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 4, 0))
      })

      it('narrow', function () {
        var result = parse('middernacht', 'bbbbb', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 4, 0))
      })
    })

    describe('flexible day period', function () {
      it('abbreviated', function () {
        var result = parse("2 's nachts", 'h B', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 4, 2))
      })

      it('wide', function () {
        var result = parse("12 's middags", 'h BBBB', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 4, 12))
      })

      it('narrow', function () {
        var result = parse("5 's avonds", 'h BBBBB', baseDate, {locale: locale})
        assert.deepEqual(result, new Date(1986, 3 /* Apr */, 4, 17))
      })
    })

    it('ordinal time', function () {
      var dateString = '1e uur, 2e minuut, 3e seconde'
      var formatString = "ho 'uur', mo 'minuut', so 'seconde'"
      var result = parse(dateString, formatString, baseDate, {locale: locale})
      assert.deepEqual(result, new Date(1986, 3 /* Apr */, 4, 1, 2, 3))
    })
  })
})
